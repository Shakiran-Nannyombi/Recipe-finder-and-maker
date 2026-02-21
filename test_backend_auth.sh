#!/bin/bash

# Test script for backend authentication endpoints
# Usage: ./test_backend_auth.sh [BACKEND_URL]
# Example: ./test_backend_auth.sh https://recipe-ai-og2y.onrender.com

BACKEND_URL=${1:-"http://localhost:8000"}

echo "Testing Recipe AI Backend Authentication"
echo "Backend URL: $BACKEND_URL"
echo "=========================================="
echo ""

# Test 1: Health check
echo "Test 1: Health Check"
echo "GET $BACKEND_URL/health"
curl -s "$BACKEND_URL/health" | jq '.' || echo "Failed to connect to backend"
echo ""
echo ""

# Test 2: Root endpoint
echo "Test 2: Root Endpoint"
echo "GET $BACKEND_URL/"
curl -s "$BACKEND_URL/" | jq '.' || echo "Failed to connect to backend"
echo ""
echo ""

# Test 3: Signup (use a unique email each time)
TIMESTAMP=$(date +%s)
TEST_EMAIL="test${TIMESTAMP}@example.com"
echo "Test 3: Signup"
echo "POST $BACKEND_URL/api/auth/signup"
echo "Email: $TEST_EMAIL"
SIGNUP_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"$TEST_EMAIL\",\"password\":\"testpass123\"}")

echo "$SIGNUP_RESPONSE" | jq '.'

# Extract token if signup was successful
TOKEN=$(echo "$SIGNUP_RESPONSE" | jq -r '.access_token // empty')

if [ -n "$TOKEN" ]; then
  echo ""
  echo "✓ Signup successful! Token received."
  echo ""
  echo ""
  
  # Test 4: Get current user
  echo "Test 4: Get Current User (with token)"
  echo "GET $BACKEND_URL/api/auth/me"
  curl -s "$BACKEND_URL/api/auth/me" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  echo ""
  echo ""
  
  # Test 5: Login with same credentials
  echo "Test 5: Login"
  echo "POST $BACKEND_URL/api/auth/login"
  curl -s -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"testpass123\"}" | jq '.'
else
  echo ""
  echo "✗ Signup failed. Check the error message above."
  echo ""
  echo "Common issues:"
  echo "  - Backend not running"
  echo "  - Supabase credentials not configured"
  echo "  - Users table doesn't exist in Supabase"
  echo "  - CORS issues (if testing from browser)"
fi

echo ""
echo "=========================================="
echo "Tests completed"
