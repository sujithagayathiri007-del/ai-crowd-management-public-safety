import time

def generate_alert(zone, risk_level):

    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")

    if risk_level == "High Risk":
        alert_message = f"[WARNING] {timestamp} | {zone} is in HIGH RISK state."
    
    elif risk_level == "Critical":
        alert_message = f"[CRITICAL ALERT] {timestamp} | {zone} requires IMMEDIATE ATTENTION!"

    else:
        return None

    return alert_message