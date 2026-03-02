from ultralytics import YOLO
import cv2

model = YOLO("../model/yolov8n.pt")

def process_frame(frame):
    results = model(frame, verbose=False)

    person_count = 0

    for r in results:
        if r.boxes is None:
            continue
        for box in r.boxes:
            class_id = int(box.cls[0])
            if class_id == 0:
                person_count += 1

    if person_count <= 3:
        risk = "Safe"
    elif person_count <= 6:
        risk = "Warning"
    elif person_count <= 10:
        risk = "High Risk"
    else:
        risk = "Critical"

    return {
        "people": person_count,
        "risk": risk
    }