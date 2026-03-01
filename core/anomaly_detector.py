# anomaly_detector.py

import numpy as np
from sklearn.ensemble import IsolationForest


class AnomalyDetector:

    def __init__(self):
        self.model = IsolationForest(
            contamination=0.1,
            random_state=42
        )
        self.data_buffer = []
        self.trained = False

    def update(self, fused_score):
        """
        Add new fused score to history buffer
        """
        self.data_buffer.append([fused_score])

        # Train model after enough data
        if len(self.data_buffer) >= 30 and not self.trained:
            self.model.fit(self.data_buffer)
            self.trained = True

    def detect(self, fused_score):
        """
        Detect anomaly
        Returns:
            -1 → anomaly
             1 → normal
        """

        if not self.trained:
            return 1  # Assume normal until trained

        prediction = self.model.predict([[fused_score]])
        return prediction[0]