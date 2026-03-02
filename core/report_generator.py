import csv
import os
from datetime import datetime


FILE_NAME = "crowd_report.csv"


def write_report(zone, risk, trend, future_risk, mode):

    file_exists = os.path.isfile(FILE_NAME)

    with open(FILE_NAME, mode="a", newline="") as file:
        writer = csv.writer(file)

        if not file_exists:
            writer.writerow([
                "Timestamp",
                "Zone",
                "Risk",
                "Trend",
                "Future_Risk",
                "Mode"
            ])

        writer.writerow([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            zone,
            risk,
            trend,
            future_risk,
            mode
        ])