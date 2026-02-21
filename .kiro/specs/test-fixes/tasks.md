# Implementation Plan: Test Fixes

## Overview

This plan addresses 45 failing tests by updating backend tests to handle authentication and frontend tests to match current UI rendering. The approach focuses on minimal, targeted fixes to restore test suite health without modifying application code.

## Tasks

- [ ] 1. Set up backend authentication test infrastructure
  - [ ] 1.1 Create authentication fixtures in backend/tests/conftest.py
    - Implement `authenticated_client` fixture that provides TestClient with auth headers
    - Implement `create_auth_headers` helper function for generating mock JWT tokens
    - Implement `mock_auth_user` fixture for user context
    - _Requirements: 1.1, 1.2, 1.4_
  
  - [ ] 1.2 Update inventory route tests to use authenticated client
    - Replace `client` fixture with `authenticated_client` in all inventory test functions
    - Update test function signatures to accept authenticated_client parameter
    - _Requirements: 1.1, 1.4_
  
  - [ ]* 1.3 Add unauthenticated access tests for inventory routes
    - Write tests that call inventory endpoints without auth headers
    - Assert 401 Unauthorized responses are returned
    - _Requirements: 1.5_
  
  - [ ]* 1.4 Write property test for error message clarity
    - **Property 1: Test failure error messages are informative**
    - **Validates: Requirements 3.3**
    - Generate random test failures and verify error messages contain expected vs actual values

- [ ] 2. Checkpoint - Verify backend tests pass
  - Run `pytest backend/tests/test_inventory_routes.py` and ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise

- [ ] 3. Fix frontend RecipeCard component tests
  - [ ] 3.1 Update dietary tag assertions in RecipeCard.test.tsx
    - Find all assertions checking for dietary tag text
    - Update to expect capitalized text (e.g., "Vegetarian" instead of "vegetarian")
    - Update for all dietary tags: Vegetarian, Vegan, Gluten-Free, etc.
    - _Requirements: 2.1_
  
  - [ ] 3.2 Update difficulty badge assertions in RecipeCard.test.tsx
    - Find all assertions checking for difficulty text
    - Update to expect capitalized text (e.g., "Easy" instead of "easy")
    - Update for all difficulty levels: Easy, Medium, Hard
    - _Requirements: 2.2_
  
  - [ ] 3.3 Remove servings display assertions from RecipeCard.test.tsx
    - Find and remove all assertions checking for servings text (e.g., "4 servings")
    - Remove related test cases if they only tested servings display
    - _Requirements: 2.3_
  
  - [ ] 3.4 Update test queries to use semantic selectors where possible
    - Replace implementation-specific queries with getByRole, getByLabelText where applicable
    - Ensure queries are resilient to minor UI changes
    - _Requirements: 2.5, 4.1_

- [ ] 4. Checkpoint - Verify frontend tests pass
  - Run `npm test RecipeCard.test.tsx` and ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise

- [ ] 5. Verify full test suite health
  - [ ] 5.1 Run complete backend test suite
    - Execute `pytest backend/` and verify zero failures
    - Check test execution time is under 30 seconds
    - _Requirements: 3.1, 3.5_
  
  - [ ] 5.2 Run complete frontend test suite
    - Execute `npm test` and verify zero failures
    - Check test execution time is under 60 seconds
    - _Requirements: 3.2, 3.5_
  
  - [ ]* 5.3 Verify test coverage is maintained
    - Generate coverage report for backend and frontend
    - Compare with baseline coverage percentages
    - Ensure coverage has not decreased
    - _Requirements: 3.4_

- [ ] 6. Final checkpoint - Confirm all tests pass
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster completion
- Focus is on fixing existing tests, not adding new functionality
- No application code changes required - only test updates
- Authentication mocking should be reusable for future tests
- Frontend test updates should make tests more resilient to UI changes
