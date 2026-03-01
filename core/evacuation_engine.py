class EvacuationEngine:

    def recommend(self, zone, risk, all_zones):

        if risk != "Critical":
            return None

        # Find safest zone
        safe_zone = None
        lowest_density = float("inf")

        for z, data in all_zones.items():
            if data["density"] < lowest_density:
                lowest_density = data["density"]
                safe_zone = z

        if safe_zone and safe_zone != zone:
            return f"Redirect crowd from {zone} to {safe_zone}"

        return "Evacuate immediately"