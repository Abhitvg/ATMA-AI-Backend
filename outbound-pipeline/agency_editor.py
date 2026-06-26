import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

ATMA_BRAND_PERSONA = """
You are the ATMA AI Agency Editor. Your job is to review and refine content to ensure it perfectly embodies the ATMA AI Brand Persona.

**Core Brand Persona:** Innovative, Authoritative, Trustworthy, Forward-Thinking.

**Editing Guidelines:**
1. **Innovative:** Use forward-looking language. Replace stale corporate buzzwords with modern tech-forward phrasing.
2. **Authoritative:** Maintain a confident, expert tone. Do not use passive voice or weak modifiers (e.g., "we think", "maybe").
3. **Trustworthy:** Ensure language is transparent and objective. Avoid over-promising or using hyperbole (e.g., "magical", "perfect").
4. **Forward-Thinking:** Emphasize strategic value and future implications over just immediate fixes.

**Task:** Rewrite the provided draft to align strictly with these guidelines. Do not change the core factual information, only the tone and style. Return the edited Markdown text directly without introductory conversational filler.
"""

async def refine_content(draft_content: str, max_tokens: int = 4000) -> str:
    """
    Passes a draft string through the Agency-Editor Agent for brand persona compliance.
    """
    if not os.getenv("OPENROUTER_API_KEY"):
        print("Warning: OPENROUTER_API_KEY not set. Returning unedited draft.")
        return draft_content

    print("Running Agency-Editor QA Agent via OpenRouter...")
    response = await client.chat.completions.create(
        model="google/gemini-2.5-flash",
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": ATMA_BRAND_PERSONA},
            {"role": "user", "content": f"Please edit this draft:\n\n{draft_content}"}
        ]
    )
    
    return response.choices[0].message.content.strip()
