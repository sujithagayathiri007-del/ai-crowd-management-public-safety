import matplotlib.pyplot as plt


class RiskGraph:

    def __init__(self):
        self.history = []

        plt.ion()  # Enable interactive mode

        self.fig, self.ax = plt.subplots(figsize=(6, 4))

        self.ax.set_title("Real-Time Risk Score Trend")
        self.ax.set_xlabel("Time (Frames)")
        self.ax.set_ylabel("Fused Risk Score")
        self.ax.set_ylim(0, 8)
        self.ax.grid(True)

    def update(self, value):
        self.history.append(value)

        # Keep only last 50 values
        if len(self.history) > 50:
            self.history.pop(0)

        self.ax.clear()

        # Plot graph
        self.ax.plot(self.history, linewidth=2)

        # Stable scale
        self.ax.set_ylim(0, 8)

        self.ax.set_title("Real-Time Risk Score Trend")
        self.ax.set_xlabel("Time (Frames)")
        self.ax.set_ylabel("Fused Risk Score")
        self.ax.grid(True)

        plt.pause(0.01)