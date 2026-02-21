"""
Pytest configuration and shared fixtures for Recipe AI tests.
"""
import sys
from pathlib import Path
from unittest.mock import MagicMock

# Add backend directory to Python path for imports
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Mock the groq module before any imports that use it
sys.modules['groq'] = MagicMock()
