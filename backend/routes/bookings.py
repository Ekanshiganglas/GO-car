from fastapi import APIRouter, HTTPException, Depends
from models.booking import BookingCreate, BookingResponse
from database import get_db
from middleware.auth import get_current_user
from utils.helpers import serialize_doc, calculate_total_price
from bson import ObjectId
from datetime import datetime, timezone
import traceback

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.post("")
async def create_booking(booking_data: BookingCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()

    try:
        car = await db.cars.find_one({"_id": ObjectId(booking_data.car_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid car ID")

    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    if not car.get("available", True):
        raise HTTPException(status_code=400, detail="Car is not available")

    try:
        total_days, total_price = calculate_total_price(
            car["price_per_day"], booking_data.start_date, booking_data.end_date
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid dates: {str(e)}")

    booking_doc = {
        "user_id": current_user["id"],
        "car_id": booking_data.car_id,
        "car_brand": car["brand"],
        "car_model": car["model"],
        "car_image": car.get("image_url", ""),
        "start_date": booking_data.start_date,
        "end_date": booking_data.end_date,
        "total_days": total_days,
        "total_price": total_price,
        "status": "pending",
        "payment_id": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    result = await db.bookings.insert_one(booking_doc)

    # Send email - don't let email failure crash the booking
    try:
        from utils.email import send_booking_confirmation
        await send_booking_confirmation(current_user["email"], booking_doc)
    except Exception as e:
        print(f"[WARN] Email failed (booking still created): {e}")

    return serialize_doc(await db.bookings.find_one({"_id": result.inserted_id}))

@router.get("")
async def get_bookings(current_user: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.bookings.find({"user_id": current_user["id"]}).sort("created_at", -1)
    bookings = []
    async for booking in cursor:
        bookings.append(serialize_doc(booking))
    return {"bookings": bookings}

@router.get("/{booking_id}")
async def get_booking(booking_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        booking = await db.bookings.find_one({"_id": ObjectId(booking_id), "user_id": current_user["id"]})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid booking ID")
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return serialize_doc(booking)

@router.put("/{booking_id}/cancel")
async def cancel_booking(booking_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        booking = await db.bookings.find_one({"_id": ObjectId(booking_id), "user_id": current_user["id"]})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid booking ID")
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking["status"] in ["completed", "canceled"]:
        raise HTTPException(status_code=400, detail=f"Cannot cancel a {booking['status']} booking")

    await db.bookings.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": {"status": "canceled"}}
    )
    updated = await db.bookings.find_one({"_id": ObjectId(booking_id)})
    return serialize_doc(updated)
