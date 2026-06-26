import sys
import os
import sys
import os
import uvicorn
from fastapi import FastAPI, BackgroundTasks, Depends, HTTPException, Security
from fastapi.security import APIKeyHeader
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import db

# Add outbound-pipeline to path so we can import blog_generator
sys.path.append(os.path.join(os.path.dirname(__file__), 'outbound-pipeline'))
import blog_generator

api_key_header = APIKeyHeader(name="X-API-Key")

def get_api_key(api_key_header: str = Security(api_key_header)):
    expected_key = os.getenv("WEBHOOK_API_KEY")
    if not expected_key:
        print("WARNING: WEBHOOK_API_KEY not set in .env! Rejecting all requests.")
        raise HTTPException(status_code=401, detail="Invalid API Key")
    if api_key_header != expected_key:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return api_key_header

app = FastAPI(title="ATMA AI Automation Webhook Server")

class BlogRequest(BaseModel):
    ai_topic: str
    target_audience: str

@app.post("/generate-blog", status_code=202)
async def generate_blog(request: BlogRequest, background_tasks: BackgroundTasks, api_key: str = Depends(get_api_key)):
    """
    Accepts a topic and target audience. Triggers the blog generation pipeline in the background.
    """
    # Run the async generation in the background so we return 202 Accepted immediately
    background_tasks.add_task(
        blog_generator.run_and_save, 
        request.ai_topic, 
        request.target_audience,
        output_dir=os.path.join(os.path.dirname(__file__), "generated_blogs")
    )
    
    return {
        "status": "Accepted", 
        "message": f"Blog generation for '{request.ai_topic}' initiated.",
        "output_destination": "/generated_blogs"
    }

@app.get("/api/outputs")
def get_outputs():
    return db.read_db()

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Mount frontend directory for static UI
app.mount("/", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "frontend"), html=True), name="frontend")

if __name__ == "__main__":
    print("Starting ATMA AI Webhook Server on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
