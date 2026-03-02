from ultralytics import YOLO
import cv2
import requests
import time
from datetime import datetime


def get_location():
    try:
        response = requests.get("http://ip-api.com/json/")
        data = response.json()

        city = data.get("city", "")
        region = data.get("regionName", "")
        country = data.get("country", "")
        lat = data.get("lat", "")
        lon = data.get("lon", "")

        location_text = f"{city}, {region}, {country}"
        return location_text, lat, lon

    except:
        return "Unknown Location", "", ""


LOCATION_NAME, LATITUDE, LONGITUDE = get_location()



STREAM_URL = "http://10.209.216.12:4747/video"


BOT_TOKEN = "8407651924:AAFP1OEXsf9HLigzQsokdHLUA0ff5vSRpVY"
CHAT_ID = "7796601178"

ALERT_COOLDOWN = 20
last_alert_time = 0


def send_alert_with_image(frame, person_count):
    global last_alert_time

    current_time = time.time()

    if current_time - last_alert_time < ALERT_COOLDOWN:
        return

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cv2.putText(frame,
                f"Location: {LOCATION_NAME}",
                (10, 460),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 0, 255),
                2)

    cv2.putText(frame,
                f"Time: {timestamp}",
                (10, 430),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 0, 255),
                2)

    image_path = "alert_snapshot.jpg"
    cv2.imwrite(image_path, frame)

    caption = f"""
🚨 CROWD ALERT 🚨

Location: {LOCATION_NAME}
Latitude: {LATITUDE}
Longitude: {LONGITUDE}
Time: {timestamp}
People Count: {person_count}

Immediate action required.
"""

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto"

    try:
        with open(image_path, "rb") as photo:
            requests.post(
                url,
                data={"chat_id": CHAT_ID, "caption": caption},
                files={"photo": photo}
            )

        print("📸 Snapshot + Location Sent")
        last_alert_time = current_time

    except:
        print("❌ Failed to send alert")


model = YOLO("yolov8n.pt")

cap = cv2.VideoCapture(STREAM_URL, cv2.CAP_FFMPEG)

if not cap.isOpened():
    print("❌ Camera connection failed")
    exit()

print("✅ DroidCam Connected")
print("📍 Location:", LOCATION_NAME)

while True:

    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.resize(frame, (640, 480))

    results = model(frame, conf=0.4, verbose=False)

    person_count = 0

    for r in results:
        if r.boxes is None:
            continue

        for box in r.boxes:
            if int(box.cls[0]) == 0:
                person_count += 1

                x1, y1, x2, y2 = map(int, box.xyxy[0])

                cv2.rectangle(frame,
                              (x1, y1),
                              (x2, y2),
                              (0, 255, 0),
                              2)

    if person_count <= 3:
        status = "Normal"
        color = (0, 255, 0)

    elif person_count <= 15:
        status = "Moderate"
        color = (0, 255, 255)

    else:
        status = "CRITICAL"
        color = (0, 0, 255)
        send_alert_with_image(frame.copy(), person_count)

    text = f"People: {person_count} | Status: {status}"

    cv2.putText(frame,
                text,
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                color,
                2)

    cv2.putText(frame,
                f"Location: {LOCATION_NAME}",
                (10, 60),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (255, 255, 255),
                2)

    cv2.imshow("AI Crowd Live System", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()