import os
import requests
import json

HF_TOKEN = os.getenv("HF_TOKEN")           # Free token from huggingface.co
MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2"

def generate_article(keyword):
    endpoint = f"https://api-inference.huggingface.co/models/{MODEL_ID}"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    prompt = f"""You are a senior technical writer. Write a 1500-word, SEO-optimized, HTML-formatted guide for the keyword "{keyword}". 
Include:
- An H1 title containing the keyword.
- Three H2 sections with bullet-point takeaways.
- A concise meta description (max 150 characters).
- Frequently asked questions (FAQ) with schema-compatible answers."""
    payload = {
        "inputs": prompt, 
        "parameters": {
            "max_new_tokens": 1024, 
            "temperature": 0.7
        }
    }
    
    response = requests.post(endpoint, headers=headers, json=payload)
    if response.status_code == 429:
        raise RuntimeError("HF free tier quota exceeded – pause or upgrade.")
    elif response.status_code != 200:
        raise RuntimeError(f"HF API returned status {response.status_code}: {response.text}")
        
    return response.json()[0]["generated_text"]

if __name__ == "__main__":
    if not HF_TOKEN:
        print("Warning: HF_TOKEN environment variable not set. The API request will likely fail.")
        
    try:
        article = generate_article("enterprise RAG pipelines")
        print("Generated Article Preview:")
        print("--------------------------")
        print(article[:500] + "...\n")
        
        # Save to file
        with open("draft_article.md", "w") as f:
            f.write(article)
        print("✅ Article saved to draft_article.md")
    except Exception as e:
        print(f"Error generating article: {e}")
