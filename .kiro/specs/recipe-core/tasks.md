# Tasks: Recipe Core Feature

## 1. Project Initialization

- [x] 1.1 Initialize FastAPI backend structure
  - [x] 1.1.1 Create backend/ directory with main.py
  - [x] 1.1.2 Set up requirements.txt with FastAPI, Pydantic v2, boto3, uvicorn
  - [x] 1.1.3 Create routes/, services/, and models/ directories
  - [x] 1.1.4 Configure CORS middleware
  - [x] 1.1.5 Add health check endpoint

- [x] 1.2 Initialize React frontend structure
  - [x] 1.2.1 Create frontend/ directory with Vite + React + TypeScript
  - [x] 1.2.2 Set up Tailwind CSS configuration
  - [x] 1.2.3 Create components/, hooks/, services/, and pages/ directories
  - [x] 1.2.4 Configure API client with axios or fetch
  - [x] 1.2.5 Set up environment variables for API URL

## 2. Backend - Bedrock Service

- [ ] 2.1 Create Bedrock service wrapper
  - [ ] 2.1.1 Implement BedrockService class with boto3 client
  - [ ] 2.1.2 Create prompt builder for recipe generation
  - [ ] 2.1.3 Implement model invocation with error handling
  - [ ] 2.1.4 Parse Claude 3 response into Recipe model 
  - [ ] 2.1.5 Add retry logic for transient failures

- [ ] 2.2 Create recipe generation endpoint
  - [ ] 2.2.1 Define RecipeGenerationRequest Pydantic model
  - [ ] 2.2.2 Create POST /api/recipes/generate route
  - [ ] 2.2.3 Validate input with Pydantic
  - [ ] 2.2.4 Call BedrockService to generate recipe
  - [ ] 2.2.5 Return standardized response format

- [ ] 2.3 Write tests for Bedrock service
  - [ ] 2.3.1 Mock Bedrock API calls
  - [ ] 2.3.2 Test prompt generation
  - [ ] 2.3.3 Test response parsing
  - [ ] 2.3.4 Test error handling

## 3. Backend - DynamoDB Integration

- [ ] 3.1 Create DynamoDB service
  - [ ] 3.1.1 Implement DynamoDBService class
  - [ ] 3.1.2 Create save_recipe method
  - [ ] 3.1.3 Create get_recipe method
  - [ ] 3.1.4 Create list_recipes method with pagination
  - [ ] 3.1.5 Add error handling for DynamoDB operations

- [ ] 3.2 Create recipe storage endpoints
  - [ ] 3.2.1 Create GET /api/recipes/{recipe_id} route
  - [ ] 3.2.2 Create GET /api/recipes route with pagination
  - [ ] 3.2.3 Integrate with DynamoDBService
  - [ ] 3.2.4 Return standardized response format

- [ ] 3.3 Write tests for DynamoDB service
  - [ ] 3.3.1 Use moto for DynamoDB mocking
  - [ ] 3.3.2 Test recipe CRUD operations
  - [ ] 3.3.3 Test pagination
  - [ ] 3.3.4 Test error scenarios

## 4. Backend - Vector Search

- [ ] 4.1 Implement vector search service
  - [ ] 4.1.1 Create VectorSearchService class
  - [ ] 4.1.2 Integrate embeddings model (sentence-transformers or Bedrock)
  - [ ] 4.1.3 Implement embedding generation
  - [ ] 4.1.4 Implement cosine similarity search
  - [ ] 4.1.5 Add caching for embeddings

- [ ] 4.2 Create search endpoint
  - [ ] 4.2.1 Define SearchRequest Pydantic model
  - [ ] 4.2.2 Create POST /api/recipes/search route
  - [ ] 4.2.3 Validate input with Pydantic
  - [ ] 4.2.4 Call VectorSearchService
  - [ ] 4.2.5 Return ranked results with standardized format

- [ ] 4.3 Write tests for vector search
  - [ ] 4.3.1 Test embedding generation
  - [ ] 4.3.2 Test similarity calculation
  - [ ] 4.3.3 Test search ranking
  - [ ] 4.3.4 Test edge cases (empty query, no results)

## 5. Backend - Inventory Management

- [ ] 5.1 Create inventory service
  - [ ] 5.1.1 Extend DynamoDBService for inventory operations
  - [ ] 5.1.2 Implement save_inventory method
  - [ ] 5.1.3 Implement get_inventory method
  - [ ] 5.1.4 Implement add_item and remove_item methods

- [ ] 5.2 Create inventory endpoints
  - [ ] 5.2.1 Create GET /api/inventory route
  - [ ] 5.2.2 Create POST /api/inventory/items route
  - [ ] 5.2.3 Create DELETE /api/inventory/items/{ingredient_name} route
  - [ ] 5.2.4 Validate inputs with Pydantic models
  - [ ] 5.2.5 Return standardized response format

- [ ] 5.3 Create recipe matching endpoint
  - [ ] 5.3.1 Create POST /api/recipes/match-inventory route
  - [ ] 5.3.2 Implement matching algorithm (exact and partial matches)
  - [ ] 5.3.3 Return matched recipes with missing ingredients
  - [ ] 5.3.4 Add tests for matching logic

## 6. Frontend - Recipe Generator UI

- [ ] 6.1 Create ingredient input component
  - [ ] 6.1.1 Build IngredientInput.tsx with add/remove functionality
  - [ ] 6.1.2 Add input validation
  - [ ] 6.1.3 Style with Tailwind CSS
  - [ ] 6.1.4 Add autocomplete for common ingredients

- [ ] 6.2 Create preferences form
  - [ ] 6.2.1 Build PreferencesForm.tsx with dietary restrictions
  - [ ] 6.2.2 Add cuisine type selector
  - [ ] 6.2.3 Add difficulty level selector
  - [ ] 6.2.4 Style with Tailwind CSS

- [ ] 6.3 Create recipe display component
  - [ ] 6.3.1 Build GeneratedRecipe.tsx to show recipe details
  - [ ] 6.3.2 Display ingredients with quantities
  - [ ] 6.3.3 Display step-by-step instructions
  - [ ] 6.3.4 Add save recipe functionality
  - [ ] 6.3.5 Style with Tailwind CSS

- [ ] 6.4 Create recipe generator hook
  - [ ] 6.4.1 Build useRecipeGenerator.ts hook
  - [ ] 6.4.2 Handle API calls to /api/recipes/generate
  - [ ] 6.4.3 Manage loading and error states
  - [ ] 6.4.4 Add success notifications

- [ ] 6.5 Create generator page
  - [ ] 6.5.1 Build Generator.tsx page
  - [ ] 6.5.2 Integrate all generator components
  - [ ] 6.5.3 Add responsive layout
  - [ ] 6.5.4 Add loading spinner during generation

## 7. Frontend - Recipe Search UI

- [ ] 7.1 Create search bar component
  - [ ] 7.1.1 Build SearchBar.tsx with input field
  - [ ] 7.1.2 Add search button and keyboard shortcuts
  - [ ] 7.1.3 Add ingredient filter chips
  - [ ] 7.1.4 Style with Tailwind CSS

- [ ] 7.2 Create recipe card component
  - [ ] 7.2.1 Build RecipeCard.tsx for search results
  - [ ] 7.2.2 Display recipe image, title, description
  - [ ] 7.2.3 Show cooking time and difficulty
  - [ ] 7.2.4 Add click handler to view full recipe
  - [ ] 7.2.5 Style with Tailwind CSS

- [ ] 7.3 Create recipe grid component
  - [ ] 7.3.1 Build RecipeGrid.tsx for displaying results
  - [ ] 7.3.2 Implement responsive grid layout
  - [ ] 7.3.3 Add pagination controls
  - [ ] 7.3.4 Handle empty state

- [ ] 7.4 Create search hook
  - [ ] 7.4.1 Build useRecipeSearch.ts hook
  - [ ] 7.4.2 Handle API calls to /api/recipes/search
  - [ ] 7.4.3 Manage search state and results
  - [ ] 7.4.4 Add debouncing for search input

- [ ] 7.5 Create search page
  - [ ] 7.5.1 Build Search.tsx page
  - [ ] 7.5.2 Integrate search components
  - [ ] 7.5.3 Add responsive layout
  - [ ] 7.5.4 Add loading and error states

## 8. Frontend - Inventory Management UI

- [ ] 8.1 Create inventory list component
  - [ ] 8.1.1 Build InventoryList.tsx to display items
  - [ ] 8.1.2 Add remove item functionality
  - [ ] 8.1.3 Show item quantities
  - [ ] 8.1.4 Style with Tailwind CSS

- [ ] 8.2 Create add ingredient component
  - [ ] 8.2.1 Build AddIngredient.tsx with input form
  - [ ] 8.2.2 Add quantity input (optional)
  - [ ] 8.2.3 Add validation
  - [ ] 8.2.4 Style with Tailwind CSS

- [ ] 8.3 Create recipe matches component
  - [ ] 8.3.1 Build RecipeMatches.tsx to show matching recipes
  - [ ] 8.3.2 Display exact matches section
  - [ ] 8.3.3 Display partial matches with missing ingredients
  - [ ] 8.3.4 Style with Tailwind CSS

- [ ] 8.4 Create inventory hook
  - [ ] 8.4.1 Build useInventory.ts hook
  - [ ] 8.4.2 Handle API calls for inventory operations
  - [ ] 8.4.3 Manage inventory state
  - [ ] 8.4.4 Add optimistic updates

- [ ] 8.5 Create inventory page
  - [ ] 8.5.1 Build Inventory.tsx page
  - [ ] 8.5.2 Integrate inventory components
  - [ ] 8.5.3 Add responsive layout
  - [ ] 8.5.4 Add loading and error states

## 9. Testing

- [ ] 9.1 Backend unit tests
  - [ ] 9.1.1 Write tests for all service classes
  - [ ] 9.1.2 Write tests for all API endpoints
  - [ ] 9.1.3 Achieve 80%+ code coverage
  - [ ] 9.1.4 Mock all AWS service calls

- [ ] 9.2 Frontend unit tests
  - [ ] 9.2.1 Write tests for all components
  - [ ] 9.2.2 Write tests for all hooks
  - [ ] 9.2.3 Mock API calls
  - [ ] 9.2.4 Achieve 70%+ code coverage

- [ ] 9.3 Integration tests
  - [ ] 9.3.1 Test end-to-end recipe generation flow
  - [ ] 9.3.2 Test end-to-end search flow
  - [ ] 9.3.3 Test end-to-end inventory flow

## 10. Deployment

- [ ] 10.1 Create Dockerfiles
  - [ ] 10.1.1 Create backend/Dockerfile
  - [ ] 10.1.2 Create frontend/Dockerfile
  - [ ] 10.1.3 Optimize image sizes
  - [ ] 10.1.4 Add health checks

- [ ] 10.2 Prepare for AWS App Runner
  - [ ] 10.2.1 Create apprunner.yaml configuration
  - [ ] 10.2.2 Configure IAM roles for Bedrock, DynamoDB, S3
  - [ ] 10.2.3 Set up environment variables
  - [ ] 10.2.4 Configure auto-scaling settings

- [ ] 10.3 Set up DynamoDB tables
  - [ ] 10.3.1 Create recipes table with GSI for search
  - [ ] 10.3.2 Create inventory table
  - [ ] 10.3.3 Configure on-demand capacity
  - [ ] 10.3.4 Set up backup policies

- [ ] 10.4 Set up S3 bucket
  - [ ] 10.4.1 Create S3 bucket for recipe images
  - [ ] 10.4.2 Configure bucket policies
  - [ ] 10.4.3 Enable CORS for frontend access
  - [ ] 10.4.4 Set up lifecycle policies

- [ ] 10.5 Deploy to App Runner
  - [ ] 10.5.1 Deploy backend service
  - [ ] 10.5.2 Deploy frontend service
  - [ ] 10.5.3 Configure custom domain (optional)
  - [ ] 10.5.4 Test production deployment
