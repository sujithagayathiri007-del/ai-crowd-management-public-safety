import random
import time

def generate_sensor_data():

    sensor_data = {}

    zones = ["Zone_A", "Zone_B", "Zone_C", "Zone_D"]

    for zone in zones:

        footfall = random.randint(20, 150)
        pressure = random.uniform(200, 800)  # kPa simulation
        mobility_devices = random.randint(30, 200)

        sensor_data[zone] = {
            "footfall": footfall,
            "pressure": round(pressure, 2),
            "mobility_devices": mobility_devices,
            "timestamp": time.time()
        }

    return sensor_data


if __name__ == "__main__":
    while True:
        data = generate_sensor_data()
        print("\nSimulated Sensor Data:")
        for zone, values in data.items():
            print(zone, values)
        time.sleep(2)