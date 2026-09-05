from fastapi import APIRouter, HTTPException, Query
from database import get_db
from utils.helpers import serialize_doc
from bson import ObjectId
from typing import Optional

router = APIRouter(prefix="/api/cars", tags=["Cars"])

@router.get("")
async def list_cars(
    city: Optional[str] = None,
    car_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    seats: Optional[int] = None,
    fuel_type: Optional[str] = None,
    transmission: Optional[str] = None,
    available_only: bool = True,
    sort_by: Optional[str] = "price_low",
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50)
):
    db = get_db()
    query = {}

    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if car_type:
        query["car_type"] = car_type.lower()
    if min_price is not None or max_price is not None:
        price_q = {}
        if min_price is not None:
            price_q["$gte"] = min_price
        if max_price is not None:
            price_q["$lte"] = max_price
        query["price_per_day"] = price_q
    if seats:
        query["seats"] = {"$gte": seats}
    if fuel_type:
        query["fuel_type"] = fuel_type.lower()
    if transmission:
        query["transmission"] = transmission.lower()
    if available_only:
        query["available"] = True

    sort_field = "price_per_day"
    sort_dir = 1
    if sort_by == "price_high":
        sort_field = "price_per_day"
        sort_dir = -1
    elif sort_by == "rating":
        sort_field = "rating"
        sort_dir = -1
    elif sort_by == "newest":
        sort_field = "created_at"
        sort_dir = -1

    skip = (page - 1) * limit
    total = await db.cars.count_documents(query)
    cursor = db.cars.find(query).sort(sort_field, sort_dir).skip(skip).limit(limit)
    cars = []
    async for car in cursor:
        cars.append(serialize_doc(car))

    return {
        "cars": cars,
        "total": total,
        "page": page,
        "pages": max((total + limit - 1) // limit, 1)
    }

@router.get("/cities/list")
async def get_cities():
    db = get_db()
    cities = await db.cars.distinct("city")
    return {"cities": sorted(cities)}

@router.get("/{car_id}")
async def get_car(car_id: str):
    db = get_db()
    try:
        car = await db.cars.find_one({"_id": ObjectId(car_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid car ID")
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return serialize_doc(car)
