from fastapi import FastAPI, Request 
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

api = FastAPI()

fake_incident_data = [
    {"time_date": "2025-03-29 08:30", 
    "id": "e8cb5c47-a8fc-43f1-9a07-b189148ca431k2",
    "building": "Building A", "primary_category": "Fire", "incident_category": "Electrical Fire", "secondary_category": "Short Circuit",
    "incident_url": "https://firebasestorage.googleapis.com/v0/b/discute-d033d.appspot.com/o/uploads%2Fai-implementation.png?alt=media&token=c9581d00-cecb-4e78-b8cd-3f7c3b9d85ea"
     ,"severity": "High", "incident_level": "Level 3", "probability": "Likely", "description": "Smoke detected in server room."},
]


api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"]  
)

@api.get("/incidents")
async def get_incidents():
    return fake_incident_data

@api.post("/incidents")
async def post_incidents(request: Request):
    data = await request.json()
    fake_incident_data.append(data)
    return fake_incident_data

if __name__ == "__main__":
    uvicorn.run("main:api", host="0.0.0.0", port=3500, reload=True)
