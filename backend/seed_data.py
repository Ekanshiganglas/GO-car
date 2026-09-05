import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
import bcrypt
from datetime import datetime, timezone

SAMPLE_CARS = [
    {
        "brand": "Toyota", "model": "Camry", "year": 2024, "price_per_day": 45,
        "city": "Mumbai", "car_type": "sedan", "seats": 5, "fuel_type": "petrol",
        "transmission": "automatic",
        "image_url": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
        "description": "Reliable and fuel-efficient sedan perfect for city driving and long trips.",
        "features": ["Bluetooth", "Cruise Control", "Backup Camera", "Apple CarPlay"],
        "available": True, "rating": 4.7, "total_trips": 120
    },
    {
        "brand": "BMW", "model": "3 Series", "year": 2024, "price_per_day": 120,
        "city": "Delhi", "car_type": "luxury", "seats": 5, "fuel_type": "petrol",
        "transmission": "automatic",
        "image_url": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
        "description": "Premium luxury sedan with sporty performance and elegant design.",
        "features": ["Leather Seats", "Sunroof", "Navigation", "Heated Seats", "Premium Sound"],
        "available": True, "rating": 4.9, "total_trips": 85
    },
    {
        "brand": "Honda", "model": "City", "year": 2023, "price_per_day": 35,
        "city": "Bangalore", "car_type": "sedan", "seats": 5, "fuel_type": "petrol",
        "transmission": "manual",
        "image_url": "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
        "description": "Compact sedan with excellent mileage and smooth handling.",
        "features": ["Bluetooth", "USB Charging", "Airbags", "ABS"],
        "available": True, "rating": 4.5, "total_trips": 200
    },
    {
        "brand": "Mahindra", "model": "XUV700", "year": 2024, "price_per_day": 75,
        "city": "Mumbai", "car_type": "suv", "seats": 7, "fuel_type": "diesel",
        "transmission": "automatic",
        "image_url": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
        "description": "Powerful SUV with advanced tech features and spacious interiors.",
        "features": ["ADAS", "Panoramic Sunroof", "Wireless Charging", "360 Camera", "Ventilated Seats"],
        "available": True, "rating": 4.8, "total_trips": 95
    },
    {
        "brand": "Tesla", "model": "Model 3", "year": 2024, "price_per_day": 150,
        "city": "Bangalore", "car_type": "luxury", "seats": 5, "fuel_type": "electric",
        "transmission": "automatic",
        "image_url": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
        "description": "All-electric luxury with autopilot capabilities and zero emissions.",
        "features": ["Autopilot", "15\" Touchscreen", "Premium Audio", "Glass Roof", "Fast Charging"],
        "available": True, "rating": 4.9, "total_trips": 60
    },
    {
        "brand": "Maruti Suzuki", "model": "Swift", "year": 2023, "price_per_day": 25,
        "city": "Chennai", "car_type": "hatchback", "seats": 5, "fuel_type": "petrol",
        "transmission": "manual",
        "image_url": "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800&q=80",
        "description": "India's favorite hatchback. Zippy, affordable, and easy to drive.",
        "features": ["Bluetooth", "Airbags", "Power Windows", "Central Locking"],
        "available": True, "rating": 4.3, "total_trips": 350
    },
    {
        "brand": "Hyundai", "model": "Creta", "year": 2024, "price_per_day": 65,
        "city": "Hyderabad", "car_type": "suv", "seats": 5, "fuel_type": "diesel",
        "transmission": "automatic",
        "image_url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
        "description": "Feature-loaded compact SUV with bold design and comfortable ride.",
        "features": ["Panoramic Sunroof", "Ventilated Seats", "ADAS", "Bose Sound", "Connected Car"],
        "available": True, "rating": 4.6, "total_trips": 150
    },
    {
        "brand": "Mercedes-Benz", "model": "C-Class", "year": 2024, "price_per_day": 180,
        "city": "Delhi", "car_type": "luxury", "seats": 5, "fuel_type": "petrol",
        "transmission": "automatic",
        "image_url": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
        "description": "The epitome of luxury driving. Refined, powerful, and prestigious.",
        "features": ["MBUX System", "Burmester Audio", "Digital Cockpit", "Ambient Lighting", "Heated Seats"],
        "available": True, "rating": 4.9, "total_trips": 45
    },
    {
        "brand": "Toyota", "model": "Fortuner", "year": 2024, "price_per_day": 95,
        "city": "Pune", "car_type": "suv", "seats": 7, "fuel_type": "diesel",
        "transmission": "automatic",
        "image_url": "https://images.unsplash.com/photo-1606611013016-969c19ba27b5?w=800&q=80",
        "description": "The king of SUVs. Rugged, reliable, and built for adventure.",
        "features": ["4WD", "Cruise Control", "Leather Seats", "Touchscreen", "Rear AC"],
        "available": True, "rating": 4.7, "total_trips": 110
    },
    {
        "brand": "Kia", "model": "Seltos", "year": 2023, "price_per_day": 55,
        "city": "Kolkata", "car_type": "suv", "seats": 5, "fuel_type": "petrol",
        "transmission": "automatic",
        "image_url": "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
        "description": "Stylish compact SUV with premium features at an accessible price.",
        "features": ["UVO Connect", "Sunroof", "Air Purifier", "Wireless Charging", "Heads-Up Display"],
        "available": True, "rating": 4.5, "total_trips": 130
    },
    {
        "brand": "Audi", "model": "A4", "year": 2024, "price_per_day": 160,
        "city": "Mumbai", "car_type": "luxury", "seats": 5, "fuel_type": "petrol",
        "transmission": "automatic",
        "image_url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
        "description": "Sophisticated German engineering with cutting-edge technology.",
        "features": ["Virtual Cockpit", "MMI Navigation", "Bang & Olufsen Audio", "Matrix LED", "Quattro AWD"],
        "available": True, "rating": 4.8, "total_trips": 55
    },
    {
        "brand": "Tata", "model": "Nexon EV", "year": 2024, "price_per_day": 50,
        "city": "Jaipur", "car_type": "suv", "seats": 5, "fuel_type": "electric",
        "transmission": "automatic",
        "image_url": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
        "description": "India's best-selling electric SUV. Eco-friendly and fun to drive.",
        "features": ["ZConnect", "Fast Charging", "Sunroof", "Harman Audio", "Connected Car Tech"],
        "available": True, "rating": 4.4, "total_trips": 80
    },
    {
        "brand": "Ford", "model": "Mustang", "year": 2023, "price_per_day": 200,
        "city": "Bangalore", "car_type": "convertible", "seats": 4, "fuel_type": "petrol",
        "transmission": "automatic",
        "image_url": "https://images.unsplash.com/photo-1584345604476-8ec5f82d661f?w=800&q=80",
        "description": "Iconic American muscle. Open-top thrills and V8 power.",
        "features": ["V8 Engine", "Convertible Top", "Premium Audio", "Track Mode", "Launch Control"],
        "available": True, "rating": 4.9, "total_trips": 30
    },
    {
        "brand": "Honda", "model": "Amaze", "year": 2023, "price_per_day": 30,
        "city": "Chennai", "car_type": "sedan", "seats": 5, "fuel_type": "diesel",
        "transmission": "manual",
        "image_url": "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80",
        "description": "Compact sedan with diesel efficiency and Honda reliability.",
        "features": ["Bluetooth", "Airbags", "ABS", "Touchscreen"],
        "available": True, "rating": 4.2, "total_trips": 180
    },
    {
        "brand": "Toyota", "model": "Innova Crysta", "year": 2024, "price_per_day": 85,
        "city": "Hyderabad", "car_type": "minivan", "seats": 8, "fuel_type": "diesel",
        "transmission": "automatic",
        "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
        "description": "The ultimate family MPV. Spacious, comfortable, and dependable.",
        "features": ["Captain Seats", "Rear AC", "Touchscreen", "Cruise Control", "Auto Headlamps"],
        "available": True, "rating": 4.7, "total_trips": 160
    },
    {
        "brand": "Volkswagen", "model": "Polo", "year": 2022, "price_per_day": 28,
        "city": "Pune", "car_type": "hatchback", "seats": 5, "fuel_type": "petrol",
        "transmission": "manual",
        "image_url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
        "description": "German-engineered hatchback with solid build quality.",
        "features": ["Bluetooth", "Cruise Control", "Airbags", "Touchscreen"],
        "available": True, "rating": 4.3, "total_trips": 220
    },
]

async def seed():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]

    # Clear existing data
    await db.users.delete_many({})
    await db.cars.delete_many({})
    await db.bookings.delete_many({})
    await db.payments.delete_many({})

    # Create admin user
    admin_pw = bcrypt.hashpw(settings.ADMIN_PASSWORD.encode("utf-8"), bcrypt.gensalt())
    await db.users.insert_one({
        "name": "Admin",
        "email": settings.ADMIN_EMAIL,
        "password": admin_pw.decode("utf-8"),
        "phone": "+91-9999999999",
        "role": "admin",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    print("[OK] Admin user created: admin@gocar.com / admin123")

    # Create sample user
    user_pw = bcrypt.hashpw("user123".encode("utf-8"), bcrypt.gensalt())
    await db.users.insert_one({
        "name": "John Doe",
        "email": "user@gocar.com",
        "password": user_pw.decode("utf-8"),
        "phone": "+91-8888888888",
        "role": "user",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    print("[OK] Sample user created: user@gocar.com / user123")

    # Insert cars
    for car in SAMPLE_CARS:
        car["created_at"] = datetime.now(timezone.utc).isoformat()

    await db.cars.insert_many(SAMPLE_CARS)
    print(f"[OK] {len(SAMPLE_CARS)} cars seeded with real images!")

    client.close()
    print("\n[DONE] GoCar database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
