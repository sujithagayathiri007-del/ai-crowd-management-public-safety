class EscalationForecast:

    def __init__(self):
        self.zone_history = {}

    def update(self, zone, current_density, critical_threshold):
        if zone not in self.zone_history:
            self.zone_history[zone] = []

        history = self.zone_history[zone]
        history.append(current_density)

        # Keep last 10 frames
        if len(history) > 10:
            history.pop(0)

        if len(history) < 5:
            return None

        # Calculate growth rate
        growth = history[-1] - history[0]

        if growth <= 0:
            return None

        remaining = critical_threshold - current_density

        if remaining <= 0:
            return "Already Critical"

        # Estimate frames to critical
        frames_to_critical = remaining / (growth / len(history))

        seconds = frames_to_critical * 0.1  # assuming 10 FPS

        if seconds < 60:
            return f"Critical in {int(seconds)} sec"
        else:
            return None