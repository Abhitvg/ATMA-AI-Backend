import os
import asyncio
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

async def process_chat_history(chat_history: str) -> dict:
    if not os.getenv("OPENROUTER_API_KEY"):
        return {"level": 1, "primary_pain_point": "Manual processes"}

    # Researcher Agent
    print("Running Researcher Agent via OpenRouter...")
    research_res = await client.chat.completions.create(
        model="google/gemini-2.5-flash",
        max_tokens=1000,
        messages=[
            {"role": "system", "content": "You are an expert trend researcher. Analyze the chat history and extract the core pain point in exactly 3-5 words."},
            {"role": "user", "content": f"Chat History:\n{chat_history}"}
        ]
    )
    pain_point = research_res.choices[0].message.content.strip()

    # Strategist Agent
    print("Running Strategist Agent via OpenRouter...")
    strategy_res = await client.chat.completions.create(
        model="google/gemini-2.5-flash",
        max_tokens=1000,
        messages=[
            {"role": "system", "content": "You are a deal strategist. Assign an integer level 1, 2, or 3 based on the pain point. 1=Quick Wins, 2=Analytics, 3=Transformation. Only output the integer."},
            {"role": "user", "content": f"Pain Point:\n{pain_point}"}
        ]
    )
    level_str = strategy_res.choices[0].message.content.strip()
    
    level = 2
    try:
        level = int(''.join(filter(str.isdigit, level_str)))
    except ValueError:
        pass

    return {
        "primary_pain_point": pain_point,
        "level": level
    }

def process_sync(chat_history: str):
    return asyncio.run(process_chat_history(chat_history))

if __name__ == "__main__":
    sample_chat = "We are a logistics company spending too much time entering data."
    print(process_sync(sample_chat))
