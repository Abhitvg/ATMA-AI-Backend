import os
import asyncio
import sys
from openai import AsyncOpenAI
from dotenv import load_dotenv
from agency_editor import refine_content

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import db

load_dotenv()

client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

async def generate_blog_post(topic: str, target_audience: str) -> str:
    """
    Generates a thought leadership blog post using the OpenRouter API.
    """
    if not os.getenv("OPENROUTER_API_KEY"):
        return "# Error\nOPENROUTER_API_KEY is not set."

    # 1. Trend Analyzer Agent
    print("Running Trend Analyzer Agent via OpenRouter...")
    trend_res = await client.chat.completions.create(
        model="google/gemini-2.5-flash",
        max_tokens=1000,
        messages=[
            {"role": "system", "content": "You are a Trend Analyzer Agent. Given a broad AI topic and target audience, identify 3 highly specific, recent, and actionable sub-trends or data points that will hook the reader. Return them as a structured list."},
            {"role": "user", "content": f"Topic: {topic}\nTarget Audience: {target_audience}"}
        ]
    )
    trends = trend_res.choices[0].message.content

    # 2. Content Writer Agent
    print("Running Content Writer Agent via OpenRouter...")
    writer_system = """
    You are an expert Content Writer. Draft an SEO-optimized Thought Leadership Blog Post using the provided trends.
    Follow this structure:
    - Catchy Title (SEO optimized)
    - Introduction (Hook the reader)
    - Core Argument/Analysis (Use the provided trends)
    - Supporting Evidence (Include generic anonymized case study concepts)
    - Future Outlook
    - Conclusion & Call to Action (Contact ATMA AI)
    
    Output entirely in Markdown.
    """
    writer_res = await client.chat.completions.create(
        model="google/gemini-2.5-flash",
        max_tokens=4000,
        messages=[
            {"role": "system", "content": writer_system},
            {"role": "user", "content": f"Topic: {topic}\nTarget Audience: {target_audience}\nTrends to Include:\n{trends}"}
        ]
    )
    draft_blog = writer_res.choices[0].message.content

    # 3. Agency Editor QA
    print("Sending draft to Agency Editor for QA...")
    final_blog = await refine_content(draft_blog, max_tokens=4000)

    return final_blog

async def run_and_save(topic: str, target_audience: str, output_dir: str = "../generated_blogs"):
    blog_content = await generate_blog_post(topic, target_audience)
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    filename = topic.replace(" ", "_").lower() + ".md"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, 'w') as f:
        f.write(blog_content)
        
    # Save metadata to DB
    db.save_content_blog(topic, target_audience, filepath)
        
    print(f"Blog post generated and saved to {filepath}")
    return filepath

if __name__ == "__main__":
    asyncio.run(run_and_save("Generative AI in Retail", "CTOs and Retail Executives"))
