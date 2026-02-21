"""
Pytest configuration and shared fixtures for Recipe AI tests.
"""
import sys
from pathlib import Path
from unittest.mock import MagicMock
from datetime import datetime, timezone
import pytest

# Add backend directory to Python path for imports
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Mock the groq module before any imports that use it
sys.modules['groq'] = MagicMock()


@pytest.fixture
def mock_auth_user():
    """Fixture providing a mock authenticated user."""
    from models.auth import User
    return User(
        id="test-user-123",
        email="test@example.com",
        name="Test User",
        created_at=datetime(2024, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
    )


@pytest.fixture
def mock_get_current_user(mock_auth_user):
    """Fixture that mocks the get_current_user dependency."""
    async def _mock_get_current_user():
        return mock_auth_user
    return _mock_get_current_user
