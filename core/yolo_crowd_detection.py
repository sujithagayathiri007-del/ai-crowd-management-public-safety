from ultralytics import YOLO
import cv2
import os
import requests

from config_loader import load_config
from sensor_simulator import generate_sensor_data
from data_fusion_engine import fuse_data
from alert_manager import generate_alert
from decision_engine import generate_decision
from risk_predictor import RiskPredictor
from logger_system import log_event
from anomaly_detector import AnomalyDetector
from future_predictor import FutureRiskPredictor
from report_generator import write_report
from confidence_engine import calculate_confidence
from performance_monitor import PerformanceMonitor
from failure_simulator import FailureSimulator
from movement_analyzer import MovementAnalyzer
from escalation_forecast import EscalationForecast
from evacuation_engine import EvacuationEngine


# =============================
# 📱 TELEGRAM ALERT SYSTEM (FREE)
# =============================
BOT_TOKEN = "8407651924:AAFP1OEXsf9HLigzQsokdHLUA0ff5vSRpVY"
CHAT_ID = "7796601178"

last_alert_time = 0
ALERT_COOLDOWN = 20  # seconds


def send_mobile_alert(zone, location):
    global last_alert_time
    import time

    current_time = time.time()

    if current_time - last_alert_time < ALERT_COOLDOWN:
        return

    message = f"""
🚨 CRITICAL CROWD ALERT 🚨

Location: {location}
Zone: {zone}

Immediate action required.
"""

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

    payload = {
        "chat_id": CHAT_ID,
        "text": message
    }

    try:
        requests.post(url, data=payload)
        print("📱 Mobile Alert Sent")
        last_alert_time = current_time
    except:
        print("Failed to send Telegram alert")


# -------------------------
# LOAD CONFIG
# -------------------------
config = load_config()
video_path = config["video_path"]
zone_area = config["zone_area"]
risk_thresholds = config["risk_thresholds"]
failure_enabled = config["enable_failure_mode"]

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

# -------------------------
# INITIALIZE ENGINES
# -------------------------
risk_predictor = RiskPredictor()
anomaly_detector = AnomalyDetector()
future_predictor = FutureRiskPredictor()
performance_monitor = PerformanceMonitor()
failure_simulator = FailureSimulator()
movement_analyzer = MovementAnalyzer()
forecast_engine = EscalationForecast()
evac_engine = EvacuationEngine()

cv2.namedWindow("AI Crowd Intelligence System", cv2.WINDOW_NORMAL)
cv2.setWindowProperty(
    "AI Crowd Intelligence System",
    cv2.WND_PROP_FULLSCREEN,
    cv2.WINDOW_FULLSCREEN
)

# -------------------------
# MAIN LOOP
# -------------------------
while cap.isOpened():

    performance_monitor.start()

    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.resize(frame, (640, 480))
    height, width, _ = frame.shape
    mid_x = width // 2
    mid_y = height // 2

    movement_data = movement_analyzer.analyze(frame)
    movement_speed = movement_data["avg_speed"]
    movement_abnormal = movement_data["abnormal"]

    cv2.line(frame, (mid_x, 0), (mid_x, height), (255, 0, 0), 2)
    cv2.line(frame, (0, mid_y), (width, mid_y), (255, 0, 0), 2)

    results = model(frame, verbose=False)

    zone_counts = {
        "Zone_A": 0,
        "Zone_B": 0,
        "Zone_C": 0,
        "Zone_D": 0
    }

    for r in results:
        if r.boxes is None:
            continue

        for i, box in enumerate(r.boxes):
            if int(box.cls[0]) == 0:
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

                if r.masks is not None:
                    mask = r.masks.xy[i].astype(int)
                    cv2.polylines(frame, [mask], True, (0, 255, 0), 2)

    # -------------------------
    # DENSITY
    # -------------------------
    vision_data = {}
    for zone, count in zone_counts.items():
        density = count / zone_area
        vision_data[zone] = {"density": density}

    if failure_enabled:
        failure_simulator.inject_failure()
        vision_data = failure_simulator.apply(vision_data)

    sensor_data = generate_sensor_data()
    fused_data = fuse_data(vision_data, sensor_data)

    y_offset = 60

    for zone, values in fused_data.items():

        fused_score = values["fused_score"]
        mode = values["mode"]

        anomaly_detector.update(fused_score)
        anomaly_flag = anomaly_detector.detect(fused_score)

        if fused_score < risk_thresholds["safe"]:
            risk = "Safe"
            color = (0, 255, 0)
        elif fused_score < risk_thresholds["warning"]:
            risk = "Warning"
            color = (0, 255, 255)
        elif fused_score < risk_thresholds["high"]:
            risk = "High Risk"
            color = (0, 165, 255)
        else:
            risk = "Critical"
            color = (0, 0, 255)

        if anomaly_flag == -1:
            risk = "Critical"
            color = (0, 0, 255)

        if movement_abnormal and fused_score >= risk_thresholds["high"]:
            risk = "Critical"
            color = (0, 0, 255)

        # 📱 MOBILE ALERT TRIGGER
        if risk == "Critical":
            send_mobile_alert(zone, config.get("location_name", "Demo Location"))

        trend = risk_predictor.update(zone, fused_score)
        confidence = calculate_confidence(fused_score, anomaly_flag, trend)

        future_predictor.update(fused_score)
        future_value = future_predictor.predict_next()

        future_risk = "Unknown"
        if future_value is not None:
            if future_value < risk_thresholds["safe"]:
                future_risk = "Safe"
            elif future_value < risk_thresholds["warning"]:
                future_risk = "Warning"
            elif future_value < risk_thresholds["high"]:
                future_risk = "High Risk"
            else:
                future_risk = "Critical"

        log_event(zone, risk, trend)
        write_report(zone, risk, trend, future_risk, mode)

        line1 = f"{zone}: Score={fused_score:.2f} | Risk={risk} | Trend={trend}"
        line2 = f"Future={future_risk} | Conf={confidence}% | Mode={mode}"

        cv2.putText(frame, line1, (10, y_offset),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2)

        cv2.putText(frame, line2, (10, y_offset + 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2)

        y_offset += 45

    elapsed = performance_monitor.stop()
    avg_time = performance_monitor.average_time()
    sla_status = performance_monitor.check_sla(elapsed)

    perf_text = f"Frame: {elapsed:.2f}s | Avg: {avg_time:.2f}s | {sla_status}"
    cv2.putText(frame, perf_text, (10, 25),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

    movement_text = f"Speed: {movement_speed:.2f} | Rush: {movement_abnormal}"
    cv2.putText(frame, movement_text, (10, height - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

    cv2.imshow("AI Crowd Intelligence System", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()