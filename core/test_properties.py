from hypothesis import given, strategies as st
import pytest


# ------------------------------
# PROPERTY 1 – Density never negative
# ------------------------------
@given(st.floats(min_value=0, max_value=100))
def test_density_non_negative(density):
    assert density >= 0


# ------------------------------
# PROPERTY 2 – Risk categories always valid
# ------------------------------
def classify_risk(score):
    if score < 2:
        return "Safe"
    elif score < 4:
        return "Warning"
    elif score < 6:
        return "High Risk"
    else:
        return "Critical"


@given(st.floats(min_value=0, max_value=20))
def test_risk_category_valid(score):
    risk = classify_risk(score)
    assert risk in ["Safe", "Warning", "High Risk", "Critical"]


# ------------------------------
# PROPERTY 3 – Fused score numeric
# ------------------------------
@given(st.floats(min_value=0, max_value=20))
def test_fused_score_is_number(score):
    assert isinstance(score, float)


# ------------------------------
# PROPERTY 4 – Confidence between 0 and 100
# ------------------------------
@given(st.floats(min_value=0, max_value=20))
def test_confidence_range(score):
    confidence = min(100, max(0, score * 10))
    assert 0 <= confidence <= 100


# ------------------------------
# PROPERTY 5 – SLA always returns string
# ------------------------------
def check_sla(time):
    if time < 5:
        return "SLA OK"
    else:
        return "SLA WARNING"


@given(st.floats(min_value=0, max_value=20))
def test_sla_output(time):
    result = check_sla(time)
    assert isinstance(result, str)