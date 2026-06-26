import json
import os
import csv
import asyncio
from typing import Dict, List
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

async def generate_email_sequence(lead_data: Dict) -> Dict[str, str]:
    """
    Generates a personalized email sequence using a multi-agent pipeline via OpenRouter.
    """
    company_name = lead_data.get("title", "Your Company").split('|')[0].strip()
    url = lead_data.get("url", "#")
    demo_link = f"https://demo.atma-ai.co.in/{company_name.replace(' ', '_').lower()}"
    
    if not os.getenv("OPENROUTER_API_KEY"):
        print("OPENROUTER_API_KEY not set. Using fallback templates.")
        email_1 = f"Hi {{first_name}},\n\nI noticed {company_name} could benefit from Enterprise AI automation.\n\nMy team at Atma AI built a quick prototype specifically trained on your website ({url}):\n{demo_link}\n\nLet me know if you'd like to chat about how this could save your team hundreds of hours.\n\nBest,\nAbhishek"
        email_2 = f"Hi {{first_name}},\n\nJust floating this to the top of your inbox. Did you get a chance to check out the AI prototype we built for {company_name}? ({demo_link})\n\nHappy to schedule a quick 10-min technical briefing if it looks interesting.\n\nBest,\nAbhishek"
        return {"Email_1": email_1, "Email_2": email_2, "Demo_Link": demo_link}

    context = f"Company: {company_name}\nWebsite context: {lead_data.get('description', '')[:500]}\nDemo Link: {demo_link}"

    print("Running Brand Guardian via OpenRouter...")
    guardian_res = await client.chat.completions.create(
        model="google/gemini-2.5-flash",
        max_tokens=1000,
        messages=[
            {"role": "system", "content": "You are a Brand Guardian. Define the tone of voice and brand positioning guidelines for reaching out to this specific company. Emphasize ATMA AI's premium enterprise consulting image."},
            {"role": "user", "content": context}
        ]
    )
    brand_guidelines = guardian_res.choices[0].message.content
    
    print("Running Outbound Strategist via OpenRouter...")
    strategist_res = await client.chat.completions.create(
        model="google/gemini-2.5-flash",
        max_tokens=1000,
        messages=[
            {"role": "system", "content": "You are an Outbound Strategist. Write two short cold emails (Email 1 and Follow-up) to the decision maker. Adhere strictly to the brand guidelines. The goal is to get them to click the demo link. Keep them extremely short and punchy. Output in JSON: {\"Email_1\": \"...\", \"Email_2\": \"...\"}"},
            {"role": "user", "content": f"Context:\n{context}\n\nBrand Guidelines:\n{brand_guidelines}"}
        ],
        response_format={ "type": "json_object" }
    )
    email_result_text = strategist_res.choices[0].message.content
    
    email_1 = ""
    email_2 = ""
    
    try:
        parsed = json.loads(email_result_text)
        email_1 = parsed.get("Email_1", "")
        email_2 = parsed.get("Email_2", "")
    except Exception as e:
        print(f"Error parsing emails: {e}")

    return {
        "Email_1": email_1,
        "Email_2": email_2,
        "Demo_Link": demo_link
    }

def export_to_csv(leads_data: List[Dict], output_file="instantly_campaign_export.csv"):
    if not leads_data:
        return
        
    keys = ["Company", "Website", "Demo_Link", "Email_1", "Email_2"]
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        for row in leads_data:
            writer.writerow(row)
            
    print(f"Exported campaign data to {output_file}")

def process_outreach(input_file="scraped_leads.json"):
    try:
        with open(input_file, 'r') as f:
            leads = json.load(f)
            
        campaign_data = []
        for lead in leads:
            if lead.get("status") == "success":
                company_name = lead.get("title", "Company").split('|')[0].strip()
                emails = asyncio.run(generate_email_sequence(lead))
                
                campaign_data.append({
                    "Company": company_name,
                    "Website": lead.get("url", ""),
                    "Demo_Link": emails["Demo_Link"],
                    "Email_1": emails["Email_1"],
                    "Email_2": emails["Email_2"]
                })
                
        export_to_csv(campaign_data)
        
    except FileNotFoundError:
        print(f"Input file {input_file} not found. Run scraper first.")

if __name__ == "__main__":
    process_outreach()
