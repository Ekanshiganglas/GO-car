from fastapi import APIRouter, HTTPException, Depends, Body
from models.car import CarCreate, CarUpdate
from database import get_db
from middleware.auth import require_admin
from utils.helpers import serialize_doc
from bson import ObjectId
from datetime import datetime, timezone

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.post("/cars")
async def add_car(car_data: CarCreate, admin: dict = Depends(require_admin)):
    db = get_db()
    car_doc = {
        **car_data.model_dump(),
        "rating": 4.5,
        "total_trips": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.cars.insert_one(car_doc)
    car = await db.cars.find_one({"_id": result.inserted_id})
    return serialize_doc(car)

@router.put("/cars/{car_id}")
async def update_car(car_id: str, car_data: CarUpdate, admin: dict = Depends(require_admin)):
    db = get_db()
    update_fields = {k: v for k, v in car_data.model_dump().items() if v is not None}
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    try:
        result = await db.cars.update_one({"_id": ObjectId(car_id)}, {"$set": update_fields})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid car ID")

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Car not found")

    car = await db.cars.find_one({"_id": ObjectId(car_id)})
    return serialize_doc(car)

@router.delete("/cars/{car_id}")
async def delete_car(car_id: str, admin: dict = Depends(require_admin)):
    db = get_db()
    try:
        result = await db.cars.delete_one({"_id": ObjectId(car_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid car ID")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"message": "Car deleted successfully"}

@router.get("/bookings")
async def get_all_bookings(admin: dict = Depends(require_admin)):
    db = get_db()
    cursor = db.bookings.find().sort("created_at", -1)
    bookings = []
    async for booking in cursor:
        bookings.append(serialize_doc(booking))
    return {"bookings": bookings}

@router.put("/bookings/{booking_id}/status")
async def update_booking_status(booking_id: str, status: str = Body(..., embed=True), admin: dict = Depends(require_admin)):
    db = get_db()
    valid_statuses = ["pending", "confirmed", "active", "completed", "canceled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    try:
        result = await db.bookings.update_one({"_id": ObjectId(booking_id)}, {"$set": {"status": status}})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid booking ID")

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking = await db.bookings.find_one({"_id": ObjectId(booking_id)})
    return serialize_doc(booking)

@router.get("/stats")
async def get_stats(admin: dict = Depends(require_admin)):
    db = get_db()
    total_cars = await db.cars.count_documents({})
    total_bookings = await db.bookings.count_documents({})
    total_users = await db.users.count_documents({"role": "user"})

    # Calculate revenue from completed payments
    pipeline = [
        {"$match": {"status": "completed"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]
    revenue_cursor = db.payments.aggregate(pipeline)
    revenue = 0
    async for doc in revenue_cursor:
        revenue = doc.get("total", 0)

    # Recent bookings
    cursor = db.bookings.find().sort("created_at", -1).limit(5)
    recent_bookings = []
    async for booking in cursor:
        recent_bookings.append(serialize_doc(booking))

    return {
        "total_cars": total_cars,
        "total_bookings": total_bookings,
        "total_users": total_users,
        "total_revenue": round(revenue, 2),
        "recent_bookings": recent_bookings
    }

@router.get("/users")
async def get_all_users(admin: dict = Depends(require_admin)):
    db = get_db()
    cursor = db.users.find({}, {"password": 0}).sort("created_at", -1)
    users = []
    async for user in cursor:
        users.append(serialize_doc(user))
    return {"users": users}
