import cv2
import numpy as np


class MovementAnalyzer:
    def __init__(self):
        self.prev_gray = None

    def analyze(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        if self.prev_gray is None:
            self.prev_gray = gray
            return {
                "avg_speed": 0,
                "direction": 0,
                "abnormal": False
            }

        # Optical Flow Calculation
        flow = cv2.calcOpticalFlowFarneback(
            self.prev_gray,
            gray,
            None,
            0.5,
            3,
            15,
            3,
            5,
            1.2,
            0
        )

        magnitude, angle = cv2.cartToPolar(flow[..., 0], flow[..., 1])

        avg_speed = np.mean(magnitude)
        avg_direction = np.mean(angle)

        self.prev_gray = gray

        # Abnormal movement detection
        abnormal = avg_speed > 5  # threshold (tune if needed)

        return {
            "avg_speed": round(float(avg_speed), 2),
            "direction": round(float(avg_direction), 2),
            "abnormal": abnormal
        }