from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client: AsyncIOMotorClient = None
db = None

async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]
    print(f"[OK] Connected to MongoDB: {settings.DB_NAME}")

async def close_db():
    global client
    if client:
        client.close()
        print("[OK] MongoDB connection closed")

def get_db():
    return db
