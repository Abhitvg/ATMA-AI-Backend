import os
import sys

# Add the parent directory to the path so we can import the other scripts
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from importlib import import_module
    scraper = import_module("1_scraper_workflow")
    demo_gen = import_module("2_demo_generator")
    outreach = import_module("3_outreach_sequencer")
except ImportError as e:
    print(f"Error importing modules: {e}")
    sys.exit(1)

def main():
    print("="*50)
    print("🚀 ATMA AI - OUTBOUND CAMPAIGN RUNNER")
    print("="*50)

    # 1. Ask for Target URLs
    print("\nEnter target website URLs (comma separated):")
    urls_input = input("> ")
    if not urls_input.strip():
        print("No URLs provided. Using defaults for testing.")
        target_urls = ["https://example.com", "https://atma-ai.co.in"]
    else:
        target_urls = [url.strip() for url in urls_input.split(',')]

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
