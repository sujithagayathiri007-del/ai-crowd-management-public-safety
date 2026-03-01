import csv
import os
from datetime import datetime

def log_event(zone, risk, trend):

    file_exists = os.path.isfile("system_logs.csv")

    with open("system_logs.csv", mode='a', newline='') as file:
        writer = csv.writer(file)

        if not file_exists:
            writer.writerow(["Timestamp", "Zone", "Risk", "Trend"])

        writer.writerow([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            zone,
            risk,
            trend
        ])