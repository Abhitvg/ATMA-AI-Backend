import os
import sys
import json
import asyncio
from typing import List, Dict
import db

# Add subdirectories to path to import modules
sys.path.append(os.path.join(os.path.dirname(__file__), "inbound-agents"))
sys.path.append(os.path.join(os.path.dirname(__file__), "outbound-pipeline"))

from qualification_bot import process_chat_history
from proposal_generator import generate_proposal, ProposalData
import importlib.util

def load_module_from_path(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

demo_generator = load_module_from_path("demo_generator", os.path.join(os.path.dirname(__file__), "outbound-pipeline", "2_demo_generator.py"))
outreach_sequencer = load_module_from_path("outreach_sequencer", os.path.join(os.path.dirname(__file__), "outbound-pipeline", "3_outreach_sequencer.py"))
blog_generator = load_module_from_path("blog_generator", os.path.join(os.path.dirname(__file__), "outbound-pipeline", "4_blog_generator.py"))

async def run_inbound_pipeline():
    print("\n--- Starting Inbound Pipeline ---")
    sample_chat = """
    User: We are a large logistics company spending too much time processing invoices.
    Bot: AI can automate 90% of that data entry.
    User: We process about 10,000 invoices a month. How can we fix this?
    """
    qualification = await process_chat_history(sample_chat)
    print("\n[Qualification Result]:", qualification)
    
    # Run proposal generator based on qualification
    prop_data = ProposalData(
        email="test@logistics.com",
        metrics={"savings": 250000},
        company_name="Global Logistics",
        level=qualification.get("level", 2),
        primary_pain_point=qualification.get("primary_pain_point", "Manual data entry")
    )
    proposal = await generate_proposal(prop_data)
    print("\n[Generated Proposal]:\n", proposal)
    
    # Save to Database
    db.save_inbound_proposal(prop_data.company_name, prop_data.email, proposal)

async def run_outbound_pipeline():
    print("\n--- Starting Outbound Pipeline ---")
    
    leads_path = os.path.join(os.path.dirname(__file__), "scraped_leads.json")
    if not os.path.exists(leads_path):
        print(f"No leads file found at {leads_path}")
        return
        
    with open(leads_path, 'r') as f:
        all_leads = json.load(f)
        
    successful_leads = [lead for lead in all_leads if lead.get("status") == "success"]
    if not successful_leads:
        print("No successful leads found to process.")
        return
        
    lead_data = successful_leads[0]
    print(f"Processing lead: {lead_data.get('title', 'Unknown')} ({lead_data.get('url', 'Unknown')})")
    
    # Run demo generator and outreach sequencer in parallel
    print("Running Demo Generator & Outreach Sequencer concurrently via OpenRouter...")
    demo_task = asyncio.create_task(demo_generator.generate_demo_page(lead_data))
    email_task = asyncio.create_task(outreach_sequencer.generate_email_sequence(lead_data))
    
    demo_html, emails = await asyncio.gather(demo_task, email_task)
    
    print("\n[Generated Demo Hook & UI System]: (HTML snippet)")
    print(demo_html[:200] + "...\n")
    
    print("[Generated Email Sequence]:")
    print(emails)
    
    # Save to Database
    db.save_outbound_campaign(lead_data["title"], lead_data["url"], demo_html, emails)

async def run_content_pipeline():
    print("\n--- Starting Content Pipeline ---")
    topic = "Generative AI for Marketing"
    audience = "CMOs"
    print(f"Generating Thought Leadership Blog for {audience} on '{topic}'...")
    filepath = await blog_generator.run_and_save(topic, audience)
    print(f"Content generation complete. Saved to: {filepath}")

async def main():
    print("========================================")
    print("   ATMA AI MULTI-AGENT ORCHESTRATION    ")
    print("========================================")
    
    await run_inbound_pipeline()
    await run_outbound_pipeline()
    await run_content_pipeline()

if __name__ == "__main__":
    asyncio.run(main())
