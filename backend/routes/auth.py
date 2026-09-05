from fastapi import APIRouter, HTTPException, Depends
from models.user import UserCreate, UserLogin, UserUpdate, UserResponse, TokenResponse
from database import get_db
from middleware.auth import get_current_user
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from config import settings
from utils.helpers import serialize_doc
from bson import ObjectId
import traceback

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate):
    try:
        db = get_db()
        existing = await db.users.find_one({"email": user_data.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Hash password
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(user_data.password.encode("utf-8"), salt)

        user_doc = {
            "name": user_data.name,
            "email": user_data.email,
            "password": hashed.decode("utf-8"),
            "phone": user_data.phone or "",
            "role": "user",
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        result = await db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)

        token = jwt.encode(
            {
                "user_id": user_id,
                "exp": datetime.now(timezone.utc) + timedelta(hours=settings.JWT_EXPIRY_HOURS)
            },
            settings.JWT_SECRET,
            algorithm=settings.JWT_ALGORITHM
        )

        return TokenResponse(
            access_token=token,
            user=UserResponse(
                id=user_id,
                name=user_data.name,
                email=user_data.email,
                phone=user_data.phone or "",
                role="user",
                created_at=user_doc["created_at"]
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Signup error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    try:
        db = get_db()
        user = await db.users.find_one({"email": credentials.email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        stored_pw = user["password"]
        if isinstance(stored_pw, str):
            stored_pw = stored_pw.encode("utf-8")

        if not bcrypt.checkpw(credentials.password.encode("utf-8"), stored_pw):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        user_id = str(user["_id"])
        token = jwt.encode(
            {
                "user_id": user_id,
                "exp": datetime.now(timezone.utc) + timedelta(hours=settings.JWT_EXPIRY_HOURS)
            },
            settings.JWT_SECRET,
            algorithm=settings.JWT_ALGORITHM
        )

        return TokenResponse(
            access_token=token,
            user=UserResponse(
                id=user_id,
                name=user["name"],
                email=user["email"],
                phone=user.get("phone", ""),
                role=user.get("role", "user"),
                created_at=user.get("created_at", "")
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)

@router.put("/profile", response_model=UserResponse)
async def update_profile(update_data: UserUpdate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    update_fields = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    await db.users.update_one({"_id": ObjectId(current_user["id"])}, {"$set": update_fields})
    updated_user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
    updated_user = serialize_doc(updated_user)
    return UserResponse(
        id=updated_user["id"],
        name=updated_user["name"],
        email=updated_user["email"],
        phone=updated_user.get("phone", ""),
        role=updated_user.get("role", "user"),
        created_at=updated_user.get("created_at", "")
    )
