from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import connect_db, close_db
from routes import auth, cars, bookings, payments, admin, ai

@asynccontextmanager
async def lifespan(app):
    await connect_db()
    yield
    await close_db()

app = FastAPI(
    title="GoCar API",
    description="AI-Powered Car Renting Platform API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router)
app.include_router(cars.router)
app.include_router(bookings.router)
app.include_router(payments.router)
app.include_router(admin.router)
app.include_router(ai.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to GoCar API",
        "version": "1.0.0",
        "docs": "/docs",
    }
