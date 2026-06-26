import os
import asyncio
from typing import Dict, Any
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

class ProposalData(BaseModel):
    email: str
    metrics: Dict[str, Any]
    company_name: str = "Valued Enterprise"
    level: int = 1 # 1: Quick Wins, 2: Analytics, 3: Transformation
    primary_pain_point: str = "Manual operations"

async def generate_proposal(data: ProposalData) -> str:
    if not os.getenv("OPENROUTER_API_KEY"):
        print("OPENROUTER_API_KEY not set. Returning template.")
        return f"# Proposal for {data.company_name}\nSavings: ${data.metrics.get('savings', 0)}"

    context = f"Company: {data.company_name}\nLevel: {data.level}\nPain Point: {data.primary_pain_point}\nMetrics: {data.metrics}"

    print("Running Pricing Analyst via OpenRouter...")
    pricing_res = await client.chat.completions.create(
        model="google/gemini-2.5-flash",
        max_tokens=2000,
        messages=[
            {"role": "system", "content": "You are an expert pricing analyst. Determine an optimal pricing model (timeline and investment) for an AI implementation project based on the client's scale and pain points."},
            {"role": "user", "content": context}
        ]
    )
    pricing_strategy = pricing_res.choices[0].message.content
    
    print("Running Proposal Strategist via OpenRouter...")
    proposal_res = await client.chat.completions.create(
        model="google/gemini-2.5-flash",
        max_tokens=2000,
        messages=[
            {"role": "system", "content": "You are a proposal strategist. Write a persuasive, concise executive summary and proposal in Markdown. Incorporate the provided pricing strategy. Include Scope of Work and Next Steps."},
            {"role": "user", "content": f"Client Context:\n{context}\n\nPricing Strategy:\n{pricing_strategy}"}
        ]
    )
    proposal_result = proposal_res.choices[0].message.content
    
    return proposal_result

def run_sync(data: ProposalData):
    return asyncio.run(generate_proposal(data))

if __name__ == "__main__":
    test_data = ProposalData(
        email="test@enterprise.com",
        metrics={"savings": 150000},
        company_name="Acme Corp",
        level=2,
        primary_pain_point="Slow manual document verification taking weeks"
    )
    print("Generating test proposal with multi-agent pipeline...")
    print(run_sync(test_data))
