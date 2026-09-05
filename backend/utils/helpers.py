from bson import ObjectId
from datetime import datetime
import uuid
import random
import string

def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict."""
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id"))
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)
        elif isinstance(value, datetime):
            doc[key] = value.isoformat()
    return doc

def generate_transaction_id():
    """Generate a random transaction ID."""
    prefix = "TXN"
    rand = ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))
    return f"{prefix}{rand}"

def calculate_total_price(price_per_day: float, start_date: str, end_date: str) -> tuple:
    """Calculate total price and number of days."""
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    total_days = (end - start).days
    if total_days <= 0:
        total_days = 1
    total_price = round(price_per_day * total_days, 2)
    return total_days, total_price
