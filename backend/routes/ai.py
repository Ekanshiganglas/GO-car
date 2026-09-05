from fastapi import APIRouter, Depends
from database import get_db
from middleware.auth import get_current_user
from utils.ai_service import get_cheapest_suggestion, get_demand_prediction
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/ai", tags=["AI Suggestions"])

class SuggestRequest(BaseModel):
    start_date: str
    end_date: str
    city: Optional[str] = None
    car_type: Optional[str] = None

class DemandRequest(BaseModel):
    car_type: Optional[str] = None
    date_range: Optional[str] = None

@router.post("/suggest")
async def suggest_car(req: SuggestRequest):
    db = get_db()
    cursor = db.cars.find({"available": True})
    cars = []
    async for car in cursor:
        car["_id"] = str(car["_id"])
        cars.append(car)

    result = get_cheapest_suggestion(cars, req.start_date, req.end_date, req.city, req.car_type)
    return result

@router.post("/demand")
async def predict_demand(req: DemandRequest):
    result = get_demand_prediction(req.car_type, req.date_range)
    return result
