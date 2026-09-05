from fastapi import APIRouter, HTTPException, Depends
from models.payment import PaymentCreate, PaymentResponse
from database import get_db
from middleware.auth import get_current_user
from utils.helpers import serialize_doc, generate_transaction_id
from bson import ObjectId
from datetime import datetime, timezone

router = APIRouter(prefix="/api/payments", tags=["Payments"])

@router.post("")
async def process_payment(payment_data: PaymentCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()

    try:
        booking = await db.bookings.find_one({"_id": ObjectId(payment_data.booking_id), "user_id": current_user["id"]})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid booking ID")

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking["status"] == "confirmed":
        raise HTTPException(status_code=400, detail="Booking is already paid")
    if booking["status"] == "canceled":
        raise HTTPException(status_code=400, detail="Cannot pay for a canceled booking")

    transaction_id = generate_transaction_id()

    payment_doc = {
        "booking_id": payment_data.booking_id,
        "user_id": current_user["id"],
        "amount": booking["total_price"],
        "method": payment_data.method,
        "status": "completed",
        "transaction_id": transaction_id,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    result = await db.payments.insert_one(payment_doc)
    payment_id = str(result.inserted_id)

    await db.bookings.update_one(
        {"_id": ObjectId(payment_data.booking_id)},
        {"$set": {"status": "confirmed", "payment_id": payment_id}}
    )

    # Increment car total_trips
    await db.cars.update_one(
        {"_id": ObjectId(booking["car_id"])},
        {"$inc": {"total_trips": 1}}
    )

    payment_doc = await db.payments.find_one({"_id": result.inserted_id})
    return serialize_doc(payment_doc)

@router.get("")
async def get_payments(current_user: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.payments.find({"user_id": current_user["id"]}).sort("created_at", -1)
    payments = []
    async for payment in cursor:
        payments.append(serialize_doc(payment))
    return {"payments": payments}

@router.get("/{payment_id}")
async def get_payment(payment_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        payment = await db.payments.find_one({"_id": ObjectId(payment_id), "user_id": current_user["id"]})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid payment ID")
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return serialize_doc(payment)
