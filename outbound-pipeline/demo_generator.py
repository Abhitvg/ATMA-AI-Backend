import os
import json
import asyncio
from typing import Dict
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

async def generate_demo_page(lead_data: Dict) -> str:
    """
    Generates a personalized HTML demo page using a multi-agent pipeline via OpenRouter.
    """
    company_name = lead_data.get("title", "Your Company").split('|')[0].strip()
    url = lead_data.get("url", "#")
    
    if not os.getenv("OPENROUTER_API_KEY"):
        print("OPENROUTER_API_KEY not set. Returning template HTML.")
        return f"<html><body><h1>Demo for {company_name}</h1></body></html>"

    context = f"Company: {company_name}\nURL: {url}\nDescription: {lead_data.get('description')}\nSnippet: {lead_data.get('text_content', '')[:1000]}"

    print("Running UI Designer via OpenRouter...")
    designer_res = await client.chat.completions.create(
        model="google/gemini-2.5-flash",
        max_tokens=1000,
        messages=[
            {"role": "system", "content": "You are a UI Designer. Based on the company profile, design a premium, dark-mode visual system (colors, typography) and a 1-sentence hero hook."},
            {"role": "user", "content": context}
        ]
    )
    design_spec = designer_res.choices[0].message.content
    
    print("Running Sales Engineer via OpenRouter...")
    sales_res = await client.chat.completions.create(
        model="google/gemini-2.5-flash",
        max_tokens=1000,
        messages=[
            {"role": "system", "content": "You are a Sales Engineer. Based on the company profile, identify 3 specific, highly technical AI features (POC scope) they would benefit from. Keep them short."},
            {"role": "user", "content": context}
        ]
    )
    poc_scope = sales_res.choices[0].message.content
    
    print("Running Frontend Developer via OpenRouter...")
    dev_prompt = f"Context:\n{context}\n\nDesign Spec:\n{design_spec}\n\nPOC Scope:\n{poc_scope}"
    dev_res = await client.chat.completions.create(
        model="google/gemini-2.5-flash",
        max_tokens=3000,
        messages=[
            {"role": "system", "content": "You are a Frontend Developer. Generate a complete, single-file HTML/TailwindCSS landing page. Incorporate the designer's hook and visual system, and the sales engineer's 3 features. Make it look extremely premium, modern, and dark-themed. Return ONLY valid HTML."},
            {"role": "user", "content": dev_prompt}
        ]
    )
    html_text = dev_res.choices[0].message.content
    
    # Clean up markdown code blocks if any
    if html_text.startswith("```html"):
        html_text = html_text[7:]
    if html_text.startswith("```"):
        html_text = html_text[3:]
    if html_text.endswith("```"):
        html_text = html_text[:-3]
        
    return html_text.strip()

def process_demos(input_file="scraped_leads.json", output_dir="generated_demos"):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    try:
        with open(input_file, 'r') as f:
            leads = json.load(f)
            
        for idx, lead in enumerate(leads):
            if lead.get("status") == "success":
                company_name = lead.get("title", f"Lead_{idx}").split('|')[0].strip().replace(" ", "_").lower()
                html = asyncio.run(generate_demo_page(lead))
                
                filename = f"{company_name}_demo.html"
                filepath = os.path.join(output_dir, filename)
                
                with open(filepath, 'w') as out_f:
                    out_f.write(html)
                    
                print(f"Generated demo for {company_name}: {filepath}")
                
    except FileNotFoundError:
        print(f"Input file {input_file} not found.")

if __name__ == "__main__":
    process_demos()
