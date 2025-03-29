from fastapi import FastAPI, Request 
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

api = FastAPI()

fake_incident_data = [
    {"time_date": "2025-03-29 08:30", "building": "Building A", "primary_category": "Fire", "incident_category": "Electrical Fire", "secondary_category": "Short Circuit", "severity": "High", "incident_level": "Level 3", "probability": "Likely", "description": "Smoke detected in server room."},
    {"time_date": "2025-03-28 14:15", "building": "Building B", "primary_category": "Security", "incident_category": "Unauthorized Access", "secondary_category": "Forced Entry", "severity": "Medium", "incident_level": "Level 2", "probability": "Possible", "description": "Unidentified person entered restricted area."},
    {"time_date": "2025-03-27 10:45", "building": "Building C", "primary_category": "Health & Safety", "incident_category": "Injury", "secondary_category": "Slip & Fall", "severity": "Low", "incident_level": "Level 1", "probability": "Unlikely", "description": "Employee slipped in cafeteria, minor injury."},
    {"time_date": "2025-03-26 22:00", "building": "Building D", "primary_category": "IT", "incident_category": "System Failure", "secondary_category": "Network Outage", "severity": "High", "incident_level": "Level 3", "probability": "Likely", "description": "Company-wide internet outage."}
]

# Enable CORS
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
    uvicorn.run("main:api", host="0.0.0.0", port=3500, workers=4, reload=True)
