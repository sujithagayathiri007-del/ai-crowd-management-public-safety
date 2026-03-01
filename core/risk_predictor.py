from collections import deque

class RiskPredictor:

    def __init__(self, window_size=10):
        self.history = {}
        self.window_size = window_size

    def update(self, zone, current_score):

        if zone not in self.history:
            self.history[zone] = deque(maxlen=self.window_size)

        self.history[zone].append(current_score)

        if len(self.history[zone]) < 3:
            return "Collecting Data"

        # Simple trend logic
        if self.history[zone][-1] > self.history[zone][0]:
            return "Increasing"
        elif self.history[zone][-1] < self.history[zone][0]:
            return "Decreasing"
        else:
            return "Stable"