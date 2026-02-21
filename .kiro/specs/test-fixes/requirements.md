# Requirements Document

## Introduction

This document specifies the requirements for fixing failing tests in the Recipe AI application. The application has been updated with new features (authentication on inventory endpoints and UI changes to RecipeCard component), but the test suite has not been updated to reflect these changes. This specification addresses the 45 failing tests (30 backend, 15 frontend) to restore test coverage and ensure continued code quality.

## Glossary

- **Test_Suite**: The collection of automated tests for the Recipe AI application
- **Backend_Tests**: Pytest-based tests for FastAPI endpoints and services
- **Frontend_Tests**: Vitest and React Testing Library tests for React components
- **Auth_Token**: JWT authentication token required for protected endpoints
- **RecipeCard**: React component that displays recipe information including dietary tags, difficulty, and servings
- **Inventory_Routes**: FastAPI endpoints for managing user ingredient inventory

## Requirements

### Requirement 1: Backend Authentication Test Updates

**User Story:** As a developer, I want backend inventory route tests to handle authentication, so that tests pass with the new authentication requirements.

#### Acceptance Criteria

1. WHEN an inventory route test executes, THE Backend_Tests SHALL include valid Auth_Token in the request headers
2. WHEN authentication is required for an endpoint, THE Backend_Tests SHALL mock the authentication mechanism appropriately
3. WHEN all backend inventory tests execute, THE Test_Suite SHALL report zero authentication-related failures
4. THE Backend_Tests SHALL use FastAPI TestClient with proper authentication setup
5. WHEN testing protected endpoints, THE Backend_Tests SHALL validate both authenticated and unauthenticated access scenarios

### Requirement 2: Frontend RecipeCard Test Updates

**User Story:** As a developer, I want frontend RecipeCard tests to match the current UI implementation, so that component tests accurately validate the displayed content.

#### Acceptance Criteria

1. WHEN testing dietary tag display, THE Frontend_Tests SHALL expect capitalized tag text (e.g., "Vegetarian" not "vegetarian")
2. WHEN testing difficulty badge display, THE Frontend_Tests SHALL expect capitalized difficulty text (e.g., "Easy" not "easy")
3. WHEN testing servings display, THE Frontend_Tests SHALL not expect servings text to be rendered in the component
4. WHEN RecipeCard component tests execute, THE Test_Suite SHALL report zero UI assertion failures
5. THE Frontend_Tests SHALL use React Testing Library queries that match the current component structure

### Requirement 3: Test Suite Validation

**User Story:** As a developer, I want all tests to pass after fixes are applied, so that I can verify the application works correctly.

#### Acceptance Criteria

1. WHEN the complete backend test suite executes, THE Test_Suite SHALL report zero failures
2. WHEN the complete frontend test suite executes, THE Test_Suite SHALL report zero failures
3. WHEN any test fails, THE Test_Suite SHALL provide clear error messages indicating the failure reason
4. THE Test_Suite SHALL maintain existing test coverage percentages after fixes are applied
5. WHEN tests are executed, THE Test_Suite SHALL complete within reasonable time limits (backend < 30s, frontend < 60s)

### Requirement 4: Test Maintainability

**User Story:** As a developer, I want tests to be resilient to minor UI changes, so that future updates don't break tests unnecessarily.

#### Acceptance Criteria

1. WHEN testing UI components, THE Frontend_Tests SHALL use semantic queries (getByRole, getByLabelText) over implementation-specific queries where possible
2. WHEN testing text content, THE Frontend_Tests SHALL use flexible matchers that tolerate whitespace and formatting variations
3. THE Frontend_Tests SHALL focus on user-visible behavior rather than implementation details
4. WHEN authentication is mocked, THE Backend_Tests SHALL use reusable authentication fixtures or utilities
5. THE Backend_Tests SHALL document authentication setup requirements for future test authors
