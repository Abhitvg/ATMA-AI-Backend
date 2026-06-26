import sys
import os
import sys
import os
import uvicorn
from fastapi import FastAPI, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import db

# Add outbound-pipeline to path so we can import 4_blog_generator
sys.path.append(os.path.join(os.path.dirname(__file__), 'outbound-pipeline'))
import importlib

# Dynamic import because Python doesn't like files starting with numbers
blog_generator = importlib.import_module("4_blog_generator")

app = FastAPI(title="ATMA AI Automation Webhook Server")

class BlogRequest(BaseModel):
    ai_topic: str
    target_audience: str

@app.post("/generate-blog", status_code=202)
async def generate_blog(request: BlogRequest, background_tasks: BackgroundTasks):
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
