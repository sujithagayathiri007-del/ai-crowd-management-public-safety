def generate_decision(zone, risk_level):

    if risk_level == "Warning":
        return f"{zone}: Suggest monitoring and mild crowd redirection."

    elif risk_level == "High Risk":
        return f"{zone}: Recommend opening additional exits and restricting inflow."

    elif risk_level == "Critical":
        return f"{zone}: Immediate emergency response required. Deploy rescue teams and stop entry."

    else:
        return None