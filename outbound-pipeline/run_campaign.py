import os
import sys
import argparse

# Add the parent directory to the path so we can import the other scripts
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    import scraper_workflow as scraper
    import demo_generator as demo_gen
    import outreach_sequencer as outreach
except ImportError as e:
    print(f"Error importing modules: {e}")
    sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="ATMA AI - OUTBOUND CAMPAIGN RUNNER")
    parser.add_argument('--urls', type=str, help="Comma separated target website URLs")
    args = parser.parse_args()

    print("="*50)
    print("🚀 ATMA AI - OUTBOUND CAMPAIGN RUNNER")
    print("="*50)

    # 1. Target URLs
    if not args.urls:
        print("No URLs provided via --urls. Using defaults for testing.")
        target_urls = ["https://example.com", "https://atma-ai.co.in"]
    else:
        target_urls = [url.strip() for url in args.urls.split(',')]

    # 2. Run Scraper
    print("\n[1/3] Scraping websites and extracting business intelligence...")
    scraped_data_file = "scraped_leads.json"
    scraper.process_leads(target_urls, output_file=scraped_data_file)

    # 3. Generate Personalized Demos
    print("\n[2/3] Generating hyper-personalized AI prototypes for each lead...")
    demo_output_dir = "generated_demos"
    demo_gen.process_demos(input_file=scraped_data_file, output_dir=demo_output_dir)

    # 4. Generate Outreach Sequence
    print("\n[3/3] Drafting cold email sequence & CSV export for Instantly.ai...")
    outreach.process_outreach(input_file=scraped_data_file)

    print("\n" + "="*50)
    print("✅ CAMPAIGN GENERATION COMPLETE")
    print("="*50)
    print(f"- Personalized Demos saved in: ./{demo_output_dir}/")
    print("- Outreach CSV saved to: ./instantly_campaign_export.csv")
    print("\nNext Steps: Upload 'instantly_campaign_export.csv' to your email sender.")

if __name__ == "__main__":
    main()
