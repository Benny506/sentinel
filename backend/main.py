from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import model_engine
import uvicorn
import os

app = FastAPI(title="Project Sentinel: Fraud Detection API")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TransactionData(BaseModel):
    # Features: V1-V28, Amount, Time (Total 30)
    features: List[float]

@app.get("/health")
async def health_check():
    return {
        "status": "active",
        "engine_trained": model_engine.engine.is_trained,
        "best_model": model_engine.engine.best_model_name
    }

@app.post("/train")
async def train_models():
    """Trigger training and return leaderboard metrics"""
    try:
        metrics = model_engine.engine.train_all()
        return {
            "status": "success",
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/metrics")
async def get_metrics():
    """Returns stored metrics without re-training"""
    if not model_engine.engine.is_trained:
        # Attempt to load, but don't force train
        model_engine.engine.predict_fraud([0.0]*30) 
        
    return {
        "status": "success",
        "metrics": model_engine.engine.metrics
    }

@app.post("/detect")
async def detect_fraud(data: TransactionData):
    """Real-time inference endpoint"""
    if len(data.features) != 30:
        raise HTTPException(status_code=400, detail="Payload must contain exactly 30 features (V1-V28, Amount, Time).")
    
    try:
        probability = model_engine.engine.predict_fraud(data.features)
        # Classify based on 0.5 threshold
        prediction = 1 if probability > 0.5 else 0
        
        return {
            "fraud_probability": round(float(probability), 4),
            "prediction": "FRAUD" if prediction == 1 else "LEGITIMATE",
            "is_anomaly": prediction == 1
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
