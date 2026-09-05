from datetime import datetime
import random

def get_cheapest_suggestion(cars: list, start_date: str, end_date: str, city: str = None, car_type: str = None):
    """Rule-based cheapest car suggestion."""
    filtered = [c for c in cars if c.get("available", True)]
    if city:
        filtered = [c for c in filtered if c.get("city", "").lower() == city.lower()]
    if car_type:
        filtered = [c for c in filtered if c.get("car_type", "").lower() == car_type.lower()]

    if not filtered:
        return {"message": "No cars available matching your criteria.", "suggestion": None}

    cheapest = min(filtered, key=lambda c: c.get("price_per_day", 999999))
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    days = max((end - start).days, 1)
    total = round(cheapest["price_per_day"] * days, 2)

    avg_price = sum(c["price_per_day"] for c in filtered) / len(filtered)
    savings = round((avg_price - cheapest["price_per_day"]) * days, 2)

    return {
        "message": f"We found the best deal for you! Save ${savings:.0f} compared to the average.",
        "suggestion": {
            "car_id": str(cheapest.get("_id", cheapest.get("id", ""))),
            "brand": cheapest["brand"],
            "model": cheapest["model"],
            "price_per_day": cheapest["price_per_day"],
            "total_price": total,
            "total_days": days,
            "city": cheapest.get("city", ""),
            "car_type": cheapest.get("car_type", ""),
            "savings": max(savings, 0),
            "image_url": cheapest.get("image_url", "")
        }
    }

def get_demand_prediction(car_type: str = None, date_range: str = None):
    """Rule-based demand prediction."""
    predictions = []
    now = datetime.now()
    is_weekend = now.weekday() >= 4
    month = now.month

    if is_weekend:
        predictions.append({
            "trend": "high",
            "category": "SUV",
            "message": "SUVs are in HIGH demand this weekend! Book early for the best rates.",
            "confidence": 0.85
        })
        predictions.append({
            "trend": "medium",
            "category": "Convertible",
            "message": "Convertibles see moderate weekend demand. Great for road trips!",
            "confidence": 0.70
        })
    else:
        predictions.append({
            "trend": "medium",
            "category": "Sedan",
            "message": "Sedans have steady weekday demand. Ideal for business travel.",
            "confidence": 0.75
        })

    if month in [11, 12, 1]:
        predictions.append({
            "trend": "high",
            "category": "Luxury",
            "message": "Holiday season! Luxury cars are trending. Premium vehicles booking fast.",
            "confidence": 0.90
        })
    elif month in [5, 6, 7]:
        predictions.append({
            "trend": "high",
            "category": "SUV",
            "message": "Summer travel peak! SUVs and family cars are most popular.",
            "confidence": 0.88
        })

    predictions.append({
        "trend": "low",
        "category": "Hatchback",
        "message": "Hatchbacks offer the best value right now. Budget-friendly rides available!",
        "confidence": 0.65
    })

    if car_type:
        type_preds = [p for p in predictions if p["category"].lower() == car_type.lower()]
        if type_preds:
            return {"predictions": type_preds}

    return {"predictions": predictions[:4]}
