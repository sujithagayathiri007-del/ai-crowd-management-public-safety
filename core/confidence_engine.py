# confidence_engine.py

def calculate_confidence(fused_score, anomaly_flag, trend):

    base_confidence = 80

    # Reduce confidence if anomaly
    if anomaly_flag == -1:
        base_confidence -= 20

    # Reduce confidence if deteriorating trend
    if trend == "Increasing":
        base_confidence -= 10
    elif trend == "Decreasing":
        base_confidence += 5

    # Clamp between 50 and 99
    if base_confidence < 50:
        base_confidence = 50
    if base_confidence > 99:
        base_confidence = 99

    return base_confidence