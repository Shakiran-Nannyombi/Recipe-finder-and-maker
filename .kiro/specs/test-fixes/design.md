# Design Document: Test Fixes

## Overview

This design addresses the 45 failing tests in the Recipe AI application by updating test implementations to match current application behavior. The failures stem from two main sources: (1) backend inventory routes now require authentication but tests don't provide auth tokens, and (2) frontend RecipeCard component UI has changed but tests still expect old display formats.

The solution involves updating test setup to handle authentication and updating test assertions to match current UI rendering. This is a test-only change with no modifications to application code.

## Architecture

### Backend Test Architecture

The backend uses Pytest with FastAPI TestClient. Currently, tests directly call inventory endpoints without authentication. The fix requires:

1. **Authentication Mock Layer**: Create reusable fixtures that provide authenticated test clients
2. **Test Client Configuration**: Update TestClient instances to include authentication headers
3. **Dual Scenario Testing**: Test both authenticated (success) and unauthenticated (401) scenarios

### Frontend Test Architecture

The frontend uses Vitest with React Testing Library. Currently, tests assert on old UI text formats. The fix requires:

1. **Assertion Updates**: Update text expectations to match current capitalization and display logic
2. **Query Strategy**: Use semantic queries that are resilient to minor UI changes
3. **Component Contract Testing**: Focus on what users see, not implementation details

## Components and Interfaces

### Backend Components

#### Authentication Test Fixture

```python
# Reusable fixture for authenticated test client
@pytest.fixture
def authenticated_client(client: TestClient) -> TestClient:
    """
    Provides a TestClient with authentication headers configured.
    Returns a TestClient instance with valid auth token in headers.
    """
    # Mock authentication token
    # Configure client with auth headers
    # Return configured client
```

#### Test Helper Functions

```python
def create_auth_headers() -> dict:
    """
    Creates authentication headers for test requests.
    Returns dictionary with Authorization header containing valid JWT.
    """
    # Generate or mock JWT token
    # Return headers dict
```

### Frontend Components

#### RecipeCard Test Updates

The RecipeCard component tests need updates to match current rendering:

- **Dietary Tags**: Now rendered as capitalized (e.g., "Vegetarian", "Vegan", "Gluten-Free")
- **Difficulty Badge**: Now rendered as capitalized (e.g., "Easy", "Medium", "Hard")
- **Servings Display**: No longer rendered as text in the component

Test assertions must be updated to:
```typescript
// OLD: expect(screen.getByText('vegetarian')).toBeInTheDocument()
// NEW: expect(screen.getByText('Vegetarian')).toBeInTheDocument()

// OLD: expect(screen.getByText('easy')).toBeInTheDocument()
// NEW: expect(screen.getByText('Easy')).toBeInTheDocument()

// OLD: expect(screen.getByText('4 servings')).toBeInTheDocument()
// NEW: Remove this assertion - servings text not displayed
```

## Data Models

### Test Data Structures

#### Backend Test Data

```python
# Sample inventory item for testing
test_inventory_item = {
    "id": "test-id-123",
    "user_id": "test-user-456",
    "ingredient_name": "tomatoes",
    "quantity": 5,
    "unit": "pieces"
}

# Authentication mock data
test_auth_token = {
    "access_token": "mock-jwt-token",
    "token_type": "bearer",
    "user_id": "test-user-456"
}
```

#### Frontend Test Data

```typescript
// Sample recipe for RecipeCard testing
const testRecipe = {
  id: "recipe-123",
  title: "Test Recipe",
  dietaryTags: ["Vegetarian", "Gluten-Free"],  // Capitalized
  difficulty: "Easy",  // Capitalized
  servings: 4,  // Not displayed as text
  cookTime: 30,
  imageUrl: "https://example.com/image.jpg"
};
```

## Error Handling

### Backend Test Error Scenarios

1. **Missing Authentication**: Tests should verify 401 responses when auth token is missing
2. **Invalid Authentication**: Tests should verify 401 responses when auth token is invalid
3. **Expired Authentication**: Tests should handle expired token scenarios if applicable

### Frontend Test Error Scenarios

1. **Missing Props**: Tests should handle RecipeCard with missing optional props
2. **Empty Arrays**: Tests should handle empty dietaryTags arrays
3. **Null Values**: Tests should handle null or undefined values gracefully

## Testing Strategy

### Backend Testing Approach

**Unit Tests**:
- Update all 30 failing inventory route tests to include authentication
- Test authenticated access (200 responses)
- Test unauthenticated access (401 responses)
- Mock authentication mechanism using Pytest fixtures
- Use FastAPI TestClient with configured auth headers

**Test Organization**:
- Create shared authentication fixtures in conftest.py
- Update individual test functions to use authenticated_client fixture
- Add new tests for unauthenticated scenarios

### Frontend Testing Approach

**Unit Tests**:
- Update all 15 failing RecipeCard tests to match current UI
- Update dietary tag assertions to expect capitalized text
- Update difficulty badge assertions to expect capitalized text
- Remove servings text assertions
- Use React Testing Library semantic queries

**Test Organization**:
- Update RecipeCard.test.tsx with corrected assertions
- Ensure tests focus on user-visible behavior
- Use flexible text matching where appropriate

### Property-Based Testing

Property-based tests will validate universal behaviors across randomized inputs. Each property test will run a minimum of 100 iterations and reference its corresponding design property.

**Test Configuration**:
- Backend: Use Hypothesis for Python property-based testing
- Frontend: Use fast-check for TypeScript property-based testing
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: test-fixes, Property {N}: {property_text}**


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property Analysis

Based on the prework analysis, most acceptance criteria are specific examples or implementation guidelines rather than universal properties. The test fixes are primarily about updating specific test assertions and configurations to match current application behavior.

**Testable as Properties:**
- 3.3: Error message clarity applies to all test failures

**Testable as Examples:**
- 1.3: Backend inventory tests pass
- 1.5: Both auth scenarios are tested
- 2.1: Dietary tags use capitalized text
- 2.2: Difficulty badges use capitalized text
- 2.3: Servings text is not asserted
- 2.4: RecipeCard tests pass
- 3.1: All backend tests pass
- 3.2: All frontend tests pass
- 3.4: Coverage is maintained
- 3.5: Tests complete within time limits

**Not Testable:**
- 1.1, 1.2, 1.4, 2.5, 4.1-4.5: Implementation guidelines and code quality standards

### Properties

#### Property 1: Test failure error messages are informative

*For any* test failure in the test suite, the error message should clearly indicate the reason for failure, including expected vs actual values and the assertion that failed.

**Validates: Requirements 3.3**

### Examples to Verify

Since this feature is primarily about fixing specific test failures rather than implementing new system behavior, most validation will be through concrete examples:

1. **Backend inventory tests pass**: Run `pytest backend/tests/test_inventory_routes.py` and verify zero failures
2. **Frontend RecipeCard tests pass**: Run `npm test RecipeCard.test.tsx` and verify zero failures
3. **Full backend suite passes**: Run `pytest backend/` and verify zero failures
4. **Full frontend suite passes**: Run `npm test` and verify zero failures
5. **Coverage maintained**: Compare coverage reports before and after fixes
6. **Performance within limits**: Measure test execution time and verify < 30s backend, < 60s frontend
7. **Auth scenarios tested**: Verify tests exist for both authenticated and unauthenticated access to protected endpoints
8. **UI assertions match current rendering**: Verify dietary tags show "Vegetarian" not "vegetarian", difficulty shows "Easy" not "easy", and no servings text assertions exist
