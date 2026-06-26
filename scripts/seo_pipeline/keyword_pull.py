import os
import requests
import datetime
import pathlib

UBERSUGGEST_KEY = os.getenv("UBERSUGGEST_KEY")   # get from your free account
SEED_TOPICS = ["enterprise AI", "RAG pipelines", "LLM ops", "AI governance"]

def fetch_keywords(topic):
    url = f"https://api.ubersuggest.com/v3/keywords?keyword={topic}&lang=en&country=IN"
    headers = {"x-api-key": UBERSUGGEST_KEY}
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        print(f"Error fetching keywords for {topic}: {r.status_code}")
        return []
    data = r.json()
    # Keep only KD < 20 and volume > 500
    results = [
        (kw["keyword"], kw["search_volume"], kw["kd"])
        for kw in data.get("keywords", [])
        if kw.get("kd", 100) < 20 and kw.get("search_volume", 0) > 500
    ]
    return results[:5]   # top-5 per seed

def write_calendar(entries):
    csv_path = pathlib.Path("content_calendar.csv")
    with csv_path.open("w", newline="") as f:
        f.write("Publish_Date,Cluster,Keyword,Volume,KD,Status\n")
        start = datetime.date.today()
        for i, (cluster, kw, vol, kd) in enumerate(entries):
            pub = start + datetime.timedelta(days=4*i)
            f.write(f"{pub},{cluster},\"{kw}\",{vol},{kd},Planned\n")

if __name__ == "__main__":
    if not UBERSUGGEST_KEY:
        print("Warning: UBERSUGGEST_KEY environment variable not set.")
    
    all_entries = []
    for seed in SEED_TOPICS:
        for kw, vol, kd in fetch_keywords(seed):
            all_entries.append((seed, kw, vol, kd))
    
    if all_entries:
        write_calendar(all_entries)
        print("✅ content_calendar.csv generated")
    else:
        print("No keywords found or API error.")
