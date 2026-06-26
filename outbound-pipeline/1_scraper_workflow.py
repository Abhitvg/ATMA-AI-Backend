import os
import json
import requests
from bs4 import BeautifulSoup
from typing import List, Dict

class WebsiteScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

    def scrape_url(self, url: str) -> Dict:
        """
        Scrapes a given URL and extracts meaningful text for AI analysis.
        """
        print(f"Scraping {url}...")
        try:
            if not url.startswith('http'):
                url = 'https://' + url
                
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract basic info
            title = soup.title.string if soup.title else ""
            
            # Get meta description
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            description = meta_desc['content'] if meta_desc else ""
            
            # Extract main text
            # Remove scripts and styles
            for script in soup(["script", "style", "nav", "footer"]):
                script.extract()
                
            text = soup.get_text(separator=' ', strip=True)
            # Take first 5000 chars to avoid token limits later
            main_text = text[:5000]
            
            return {
                "url": url,
                "title": title,
                "description": description,
                "text_content": main_text,
                "status": "success"
            }
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            return {
                "url": url,
                "status": "error",
                "error": str(e)
            }

def process_leads(urls: List[str], output_file: str = "scraped_leads.json"):
    scraper = WebsiteScraper()
    results = []
    
    for url in urls:
        data = scraper.scrape_url(url)
        results.append(data)
        
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
        
    print(f"Scraped {len(results)} websites. Saved to {output_file}")
    return results

if __name__ == "__main__":
    # Test list
    sample_urls = [
        "https://www.example.com",
        "https://atma-ai.co.in"
    ]
    process_leads(sample_urls)
