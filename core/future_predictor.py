# future_predictor.py

import numpy as np
from collections import deque

class FutureRiskPredictor:

    def __init__(self, window_size=20):
        self.history = deque(maxlen=window_size)

    def update(self, fused_score):
        self.history.append(fused_score)

    def predict_next(self):
        """
        Simple linear regression prediction
        """
        if len(self.history) < 5:
            return None

        y = np.array(self.history)
        x = np.arange(len(y))

        # Linear regression
        coeffs = np.polyfit(x, y, 1)
        slope = coeffs[0]

        next_value = y[-1] + slope

        return next_value