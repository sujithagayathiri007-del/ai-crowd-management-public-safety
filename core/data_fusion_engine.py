def fuse_data(vision_data, sensor_data):

    fused_output = {}

    for zone in vision_data:

        density = vision_data[zone]["density"]
        footfall = sensor_data[zone]["footfall"]
        pressure = sensor_data[zone]["pressure"]
        mobility = sensor_data[zone]["mobility_devices"]

        # Check sensor failure
        if footfall == 0 and pressure == 0 and mobility == 0:
            fused_output[zone] = {
                "density": density,
                "fused_score": round(density, 2),
                "mode": "VISION_ONLY"
            }
            continue

        # Normalization
        footfall_score = footfall / 200
        pressure_score = pressure / 1000
        mobility_score = mobility / 200

        final_score = (
            0.4 * density +
            0.2 * footfall_score +
            0.2 * pressure_score +
            0.2 * mobility_score
        )

        fused_output[zone] = {
            "density": density,
            "fused_score": round(final_score, 2),
            "mode": "FUSED"
        }

    return fused_output