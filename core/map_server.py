import folium
import random
import json
import time
from flask import Flask, jsonify

app = Flask(__name__)

# Base location (example: Coimbatore)
BASE_LAT = 11.0168
BASE_LON = 76.9558

# Simulated zone coordinates
zone_coordinates = {
    "Zone_A": (BASE_LAT, BASE_LON),
    "Zone_B": (BASE_LAT + 0.001, BASE_LON),
    "Zone_C": (BASE_LAT, BASE_LON + 0.001),
    "Zone_D": (BASE_LAT + 0.001, BASE_LON + 0.001),
}

# Simulated live risk generator (later connect to real system)
def get_live_risk_data():
    risks = ["Safe", "Warning", "High Risk", "Critical"]
    data = {}

    for zone in zone_coordinates:
        data[zone] = {
            "risk": random.choice(risks),
            "score": round(random.uniform(0, 7), 2)
        }

    return data


@app.route("/map")
def generate_map():

    m = folium.Map(location=[BASE_LAT, BASE_LON], zoom_start=17)

    risk_data = get_live_risk_data()

    for zone, coords in zone_coordinates.items():

        risk = risk_data[zone]["risk"]
        score = risk_data[zone]["score"]

        if risk == "Safe":
            color = "green"
        elif risk == "Warning":
            color = "yellow"
        elif risk == "High Risk":
            color = "orange"
        else:
            color = "red"

        folium.Marker(
            location=[lat, lon],
            popup=f"{zone} - {risk}",
            icon=folium.Icon(color=color)
        ).add_to(m)

    m.save("live_map.html")

    return "Map Updated! Open live_map.html"


if __name__ == "__main__":
    app.run(debug=True)