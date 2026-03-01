import time

class PerformanceMonitor:

    def __init__(self):
        self.start_time = None
        self.frame_times = []

    def start(self):
        self.start_time = time.time()

    def stop(self):
        if self.start_time is None:
            return 0

        elapsed = time.time() - self.start_time
        self.frame_times.append(elapsed)
        return elapsed

    def average_time(self):
        if len(self.frame_times) == 0:
            return 0
        return sum(self.frame_times) / len(self.frame_times)

    def check_sla(self, elapsed):
        if elapsed > 5:
            return "SLA WARNING"
        return "OK"