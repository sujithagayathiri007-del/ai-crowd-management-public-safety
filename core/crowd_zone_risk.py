from ultralytics import YOLO
import cv2
import os
from sensor_simulator import generate_sensor_data
from data_fusion_engine import fuse_data
from alert_manager import generate_alert
from decision_engine import generate_decision
from risk_predictor import RiskPredictor
from logger_system import log_event
from anomaly_detector import AnomalyDetector

# -------------------------
# SETTINGS
# -------------------------
video_path = "crowd_video.mp4"
zone_area = 25

# -------------------------
# CHECK VIDEO
# -------------------------
if not os.path.exists(video_path):
    print("Video file not found!")
    exit()

# -------------------------
# LOAD MODEL
# -------------------------
model = YOLO("yolov8n-seg.pt")
cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print("Error opening video file")
    exit()

risk_predictor = RiskPredictor()
anomaly_detector = AnomalyDetector()

# -------------------------
# MAIN LOOP
# -------------------------
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.resize(frame, (640, 480))
    height, width, _ = frame.shape
    mid_x = width // 2
    mid_y = height // 2

    # Draw zone lines
    cv2.line(frame, (mid_x, 0), (mid_x, height), (255, 0, 0), 2)
    cv2.line(frame, (0, mid_y), (width, mid_y), (255, 0, 0), 2)

    results = model(frame, verbose=False)

    zone_counts = {
        "Zone_A": 0,
        "Zone_B": 0,
        "Zone_C": 0,
        "Zone_D": 0
    }

    # -------------------------
    # DETECTION + SEGMENTATION
    # -------------------------
    for r in results:
        if r.boxes is None:
            continue

        for i, box in enumerate(r.boxes):
            class_id = int(box.cls[0])

            if class_id == 0:  # Person class
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cx = (x1 + x2) // 2
                cy = (y1 + y2) // 2

                if cx < mid_x and cy < mid_y:
                    zone_counts["Zone_A"] += 1
                elif cx >= mid_x and cy < mid_y:
                    zone_counts["Zone_B"] += 1
                elif cx < mid_x and cy >= mid_y:
                    zone_counts["Zone_C"] += 1
                else:
                    zone_counts["Zone_D"] += 1

                # Draw mask
                if r.masks is not None:
                    mask = r.masks.xy[i]
                    mask = mask.astype(int)
                    cv2.polylines(frame, [mask], True, (0, 255, 0), 2)

    # -------------------------
    # DENSITY
    # -------------------------
    vision_data = {}
    for zone, count in zone_counts.items():
        density = count / zone_area
        vision_data[zone] = {"density": density}

    # -------------------------
    # SENSOR + FUSION
    # -------------------------
    sensor_data = generate_sensor_data()
    fused_data = fuse_data(vision_data, sensor_data)

    y_offset = 40

    # -------------------------
    # RISK LOOP
    # -------------------------
    for zone, values in fused_data.items():

        fused_score = values["fused_score"]
        mode = values["mode"]

        # ---- ML Anomaly Detection ----
        anomaly_detector.update(fused_score)
        anomaly_flag = anomaly_detector.detect(fused_score)

        # ---- Base Risk Logic ----
        if fused_score < 2:
            risk = "Safe"
            color = (0, 255, 0)
        elif fused_score < 4:
            risk = "Warning"
            color = (0, 255, 255)
        elif fused_score < 6:
            risk = "High Risk"
            color = (0, 165, 255)
        else:
            risk = "Critical"
            color = (0, 0, 255)

        # ---- If ML detects anomaly → escalate ----
        if anomaly_flag == -1:
            risk = "Critical"
            color = (0, 0, 255)

        # ---- Trend Prediction ----
        trend = risk_predictor.update(zone, fused_score)

        display_text = (
            f"{zone}: Score={fused_score:.2f} | "
            f"Risk={risk} | Trend={trend} | Mode={mode}"
        )

        # ---- Alert ----
        alert_message = generate_alert(zone, risk)
        if alert_message:
            print(alert_message)

        # ---- Decision ----
        decision_message = generate_decision(zone, risk)
        if decision_message:
            print(decision_message)

        # ---- Logging ----
        log_event(zone, risk, trend)

        cv2.putText(frame,
                    display_text,
                    (10, y_offset),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.55,
                    color,
                    2)

        y_offset += 30

    # -------------------------
    # HEATMAP
    # -------------------------
    overlay = frame.copy()

    zone_positions = {
        "Zone_A": (0, 0, mid_x, mid_y),
        "Zone_B": (mid_x, 0, width, mid_y),
        "Zone_C": (0, mid_y, mid_x, height),
        "Zone_D": (mid_x, mid_y, width, height)
    }

    for zone, values in fused_data.items():
        fused_score = values["fused_score"]

        if fused_score < 2:
            heat_color = (0, 255, 0)
        elif fused_score < 4:
            heat_color = (0, 255, 255)
        elif fused_score < 6:
            heat_color = (0, 165, 255)
        else:
            heat_color = (0, 0, 255)

        x1, y1, x2, y2 = zone_positions[zone]
        cv2.rectangle(overlay, (x1, y1), (x2, y2), heat_color, -1)

    alpha = 0.25
    frame = cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0)

    cv2.imshow("AI Crowd Intelligence System", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()