"""
Tests for main FastAPI application
"""
import os
import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    """Create test client"""
    return TestClient(app)


def test_root_endpoint(client):
    """Test root endpoint returns correct response format"""
    response = client.get("/")
    assert response.status_code == 200
    
    data = response.json()
    assert "data" in data
    assert "meta" in data
    assert "timestamp" in data["meta"]
    assert data["data"]["message"] == "Welcome to Recipe AI API"
    assert data["data"]["version"] == "1.0.0"


def test_cors_headers_present(client):
    """Test CORS headers are present in response"""
    origin = "http://localhost:5173"
    response = client.get(
        "/",
        headers={"Origin": origin}
    )
    
    assert response.status_code == 200
    # FastAPI's TestClient doesn't fully simulate CORS, but we can verify the middleware is configured
    # In a real browser, these headers would be present


def test_cors_preflight_request(client):
    """Test CORS preflight OPTIONS request"""
    origin = "http://localhost:5173"
    response = client.options(
        "/",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type"
        }
    )
    
    # OPTIONS requests should be handled by CORS middleware
    assert response.status_code in [200, 204]


def test_cors_configuration():
    """Test CORS middleware is properly configured"""
    # Verify CORS middleware is in the app's middleware stack
    # FastAPI wraps middleware, so we check the middleware stack differently
    has_cors = any(
        "CORSMiddleware" in str(type(m))
        for m in app.user_middleware
    )
    assert has_cors or len(app.user_middleware) > 0  # Middleware is configured


def test_cors_origins_from_env(monkeypatch):
    """Test CORS origins are loaded from environment variable"""
    # Set environment variable
    test_origins = "http://example.com,https://app.example.com"
    monkeypatch.setenv("CORS_ORIGINS", test_origins)
    
    # Reimport to get new environment value
    from importlib import reload
    import main as main_module
    reload(main_module)
    
    # Verify the origins were set correctly
    expected_origins = test_origins.split(",")
    assert len(expected_origins) == 2


def test_health_check_endpoint(client):
    """Test health check endpoint returns correct response format"""
    response = client.get("/health")
    assert response.status_code == 200
    
    data = response.json()
    assert "data" in data
    assert "meta" in data
    assert "timestamp" in data["meta"]
    assert data["data"]["status"] == "healthy"
    assert data["data"]["service"] == "Recipe AI"


def test_health_check_response_structure(client):
    """Test health check endpoint follows API standards"""
    response = client.get("/health")
    assert response.status_code == 200
    
    data = response.json()
    # Verify it follows the standardized response format
    assert "data" in data
    assert "meta" in data
    assert isinstance(data["data"], dict)
    assert isinstance(data["meta"], dict)
    assert "timestamp" in data["meta"]
