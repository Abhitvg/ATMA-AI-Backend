import json
import os
import datetime

DB_FILE = os.path.join(os.path.dirname(__file__), "data", "db.json")

def _ensure_db():
    os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, 'w') as f:
            json.dump({
                "inbound_proposals": [],
                "outbound_campaigns": [],
                "content_blogs": []
            }, f, indent=4)

def read_db():
    _ensure_db()
    with open(DB_FILE, 'r') as f:
        return json.load(f)

def write_db(data):
    _ensure_db()
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=4)

def save_inbound_proposal(company_name, email, proposal_text):
    data = read_db()
    data["inbound_proposals"].insert(0, {
        "timestamp": datetime.datetime.now().isoformat(),
        "company_name": company_name,
        "email": email,
        "proposal_text": proposal_text
    })
    write_db(data)

def save_outbound_campaign(company_name, url, demo_html, email_sequence):
    data = read_db()
    data["outbound_campaigns"].insert(0, {
        "timestamp": datetime.datetime.now().isoformat(),
        "company_name": company_name,
        "url": url,
        "demo_html": demo_html,
        "email_sequence": email_sequence
    })
    write_db(data)

def save_content_blog(topic, audience, file_path):
    data = read_db()
    data["content_blogs"].insert(0, {
        "timestamp": datetime.datetime.now().isoformat(),
        "topic": topic,
        "audience": audience,
        "file_path": file_path
    })
    write_db(data)
