from twilio.rest import Client

# 🔴 REPLACE WITH YOUR REAL TWILIO DETAILS
ACCOUNT_SID = "YOUR_ACCOUNT_SID"
AUTH_TOKEN = "YOUR_AUTH_TOKEN"
TWILIO_NUMBER = "+1234567890"   # Twilio number
POLICE_NUMBER = "+91XXXXXXXXXX"  # Police / demo number

client = Client(ACCOUNT_SID, AUTH_TOKEN)


def make_emergency_call(zone, location):
    message = f"""
    Alert. Critical crowd density detected.
    Location: {location}.
    Zone: {zone}.
    Immediate assistance required.
    """

    call = client.calls.create(
        twiml=f'<Response><Say voice="alice">{message}</Say></Response>',
        to=POLICE_NUMBER,
        from_=TWILIO_NUMBER
    )

    print("🚨 Emergency Call Triggered")
    print("Call SID:", call.sid)