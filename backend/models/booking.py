from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class BookingCreate(BaseModel):
    car_id: str
    start_date: str  # YYYY-MM-DD
    end_date: str    # YYYY-MM-DD

class BookingResponse(BaseModel):
    id: str
    user_id: str
    car_id: str
    car_brand: str
    car_model: str
    car_image: str
    start_date: str
    end_date: str
    total_days: int
    total_price: float
    status: str
    payment_id: Optional[str] = None
    created_at: str
