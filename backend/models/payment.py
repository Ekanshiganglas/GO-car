from pydantic import BaseModel, Field
from typing import Optional

class PaymentCreate(BaseModel):
    booking_id: str
    method: str = Field(default="card", pattern="^(card|upi|netbanking)$")

class PaymentResponse(BaseModel):
    id: str
    booking_id: str
    user_id: str
    amount: float
    method: str
    status: str
    transaction_id: str
    created_at: str
