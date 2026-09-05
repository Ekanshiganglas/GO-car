import logging

logger = logging.getLogger("gocar.email")

async def send_booking_confirmation(user_email: str, booking_details: dict):
    """Send booking confirmation email. Falls back to console logging."""
    subject = f"GoCar - Booking Confirmed #{booking_details.get('id', 'N/A')}"
    body = f"""
    Hi there!

    Your booking has been confirmed!

    Car: {booking_details.get('car_brand', '')} {booking_details.get('car_model', '')}
    Dates: {booking_details.get('start_date', '')} to {booking_details.get('end_date', '')}
    Total Days: {booking_details.get('total_days', '')}
    Total Price: ${booking_details.get('total_price', '')}
    Status: {booking_details.get('status', '')}

    Thank you for choosing GoCar!
    """
    logger.info(f"[EMAIL] Email to {user_email}")
    logger.info(f"Subject: {subject}")
    logger.info(f"Body: {body}")
    print(f"[EMAIL SIMULATION] Booking confirmation sent to {user_email}")
    return True

async def send_booking_reminder(user_email: str, booking_details: dict):
    """Send booking reminder email. Falls back to console logging."""
    subject = f"GoCar - Rental Reminder"
    body = f"""
    Hi there!

    Just a reminder that your rental starts on {booking_details.get('start_date', '')}!

    Car: {booking_details.get('car_brand', '')} {booking_details.get('car_model', '')}
    Pick-up City: {booking_details.get('city', 'N/A')}

    Have a great trip!
    """
    logger.info(f"[EMAIL] Reminder email to {user_email}")
    print(f"[EMAIL SIMULATION] Reminder sent to {user_email}")
    return True
