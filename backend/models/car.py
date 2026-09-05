from pydantic import BaseModel, Field
from typing import Optional, List

class CarCreate(BaseModel):
    brand: str = Field(..., min_length=1)
    model: str = Field(..., min_length=1)
    year: int = Field(..., ge=2000, le=2027)
    price_per_day: float = Field(..., gt=0)
    city: str = Field(..., min_length=1)
    car_type: str = Field(..., pattern="^(sedan|suv|hatchback|luxury|convertible|minivan)$")
    seats: int = Field(default=5, ge=2, le=12)
    fuel_type: str = Field(default="petrol", pattern="^(petrol|diesel|electric|hybrid)$")
    transmission: str = Field(default="automatic", pattern="^(automatic|manual)$")
    image_url: str = Field(default="")
    description: str = Field(default="")
    features: List[str] = Field(default=[])
    available: bool = Field(default=True)

class CarUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    price_per_day: Optional[float] = None
    city: Optional[str] = None
    car_type: Optional[str] = None
    seats: Optional[int] = None
    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    available: Optional[bool] = None

class CarResponse(BaseModel):
    id: str
    brand: str
    model: str
    year: int
    price_per_day: float
    city: str
    car_type: str
    seats: int
    fuel_type: str
    transmission: str
    image_url: str
    description: str
    features: List[str]
    available: bool
    rating: float
    total_trips: int
    created_at: str
