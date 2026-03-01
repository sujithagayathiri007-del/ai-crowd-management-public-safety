import random
import time

class FailureSimulator:

    def __init__(self):
        self.failure_mode = None

    def inject_failure(self):
        chance = random.randint(1, 100)

        if chance < 5:
            self.failure_mode = "SENSOR_FAILURE"
        elif chance < 10:
            self.failure_mode = "NETWORK_DELAY"
        elif chance < 15:
            self.failure_mode = "SPIKE_INJECTION"
        else:
            self.failure_mode = None

        return self.failure_mode

    def apply(self, vision_data):

        if self.failure_mode == "SENSOR_FAILURE":
            return {}  # simulate no sensor data

        elif self.failure_mode == "NETWORK_DELAY":
            time.sleep(2)  # delay 2 seconds
            return vision_data

        elif self.failure_mode == "SPIKE_INJECTION":
            for zone in vision_data:
                vision_data[zone]["density"] *= 2
            return vision_data

        return vision_data