import os
import pytest
import requests
from dotenv import load_dotenv
from pathlib import Path

# Load backend .env to access APP_PIN for tests
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

# Also load frontend .env to get REACT_APP_BACKEND_URL
load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")


@pytest.fixture(scope="session")
def base_url():
    url = os.environ.get("REACT_APP_BACKEND_URL")
    assert url, "REACT_APP_BACKEND_URL must be set"
    return url.rstrip("/")


@pytest.fixture(scope="session")
def app_pin():
    pin = os.environ.get("APP_PIN")
    assert pin, "APP_PIN must be set"
    return pin


@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def auth_token(base_url, app_pin):
    r = requests.post(f"{base_url}/api/auth/pin", json={"pin": app_pin}, timeout=30)
    if r.status_code != 200:
        pytest.skip(f"Could not authenticate: {r.status_code} {r.text}")
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}
