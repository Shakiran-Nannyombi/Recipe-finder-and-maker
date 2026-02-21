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

## 2. Backend - LLM Service

- [x] 2.1 Create LLM service wrapper
  - [x] 2.1.1 Implement LLMService class with LlamaIndex and Hugging Face
  - [x] 2.1.2 Create prompt builder for recipe generation
  - [x] 2.1.3 Implement model invocation with error handling
  - [x] 2.1.4 Parse LLM response into Recipe model 
  - [x] 2.1.5 Add retry logic for transient failures

- [x] 2.2 Create recipe generation endpoint
  - [x] 2.2.1 Define RecipeGenerationRequest Pydantic model
  - [x] 2.2.2 Create POST /api/recipes/generate route
  - [x] 2.2.3 Validate input with Pydantic
  - [x] 2.2.4 Call LLMService to generate recipe
  - [x] 2.2.5 Return standardized response format

- [x] 2.3 Write tests for LLM service
  - [x] 2.3.1 Mock Hugging Face/LlamaIndex calls
  - [x] 2.3.2 Test prompt generation
  - [x] 2.3.3 Test response parsing
  - [x] 2.3.4 Test error handling

## 3. Backend - Supabase Storage

- [x] 3.1 Create Supabase service
  - [x] 3.1.1 Implement SupabaseService class
  - [x] 3.1.2 Create save_recipe method
  - [x] 3.1.3 Create get_recipe method
  - [x] 3.1.4 Create list_recipes method with pagination
  - [x] 3.1.5 Add error handling for Supabase operations

- [x] 3.2 Create recipe storage endpoints
  - [x] 3.2.1 Create GET /api/recipes/{recipe_id} route
  - [x] 3.2.2 Create GET /api/recipes route with pagination
  - [x] 3.2.3 Integrate with SupabaseService
  - [x] 3.2.4 Return standardized response format

- [x] 3.3 Write tests for Supabase service
  - [x] 3.3.1 Mock Supabase client operations
  - [x] 3.3.2 Test recipe CRUD operations
  - [x] 3.3.3 Test pagination
  - [x] 3.3.4 Test error scenarios

## 4. Backend - Pinecone Vector Search

- [x] 4.1 Implement Pinecone vector search service
  - [x] 4.1.1 Create VectorSearchService class with Pinecone
  - [x] 4.1.2 Integrate sentence-transformers for embeddings
  - [x] 4.1.3 Implement embedding generation
  - [x] 4.1.4 Implement Pinecone similarity search
  - [x] 4.1.5 Add caching for embeddings

- [x] 4.2 Create search endpoint
  - [x] 4.2.1 Define SearchRequest Pydantic model
  - [x] 4.2.2 Create POST /api/recipes/search route
  - [x] 4.2.3 Validate input with Pydantic
  - [x] 4.2.4 Call VectorSearchService with Pinecone
  - [x] 4.2.5 Return ranked results with standardized format

- [x] 4.3 Write tests for Pinecone vector search
  - [x] 4.3.1 Mock Pinecone client operations
  - [x] 4.3.2 Test embedding generation
  - [x] 4.3.3 Test Pinecone search queries
  - [x] 4.3.4 Test edge cases (empty query, no results)

## 5. Backend - Inventory Management

- [x] 5.1 Create inventory service
  - [x] 5.1.1 Extend SupabaseService for inventory operations
  - [x] 5.1.2 Implement save_inventory method
  - [x] 5.1.3 Implement get_inventory method
  - [x] 5.1.4 Implement add_item and remove_item methods

- [x] 5.2 Create inventory endpoints
  - [x] 5.2.1 Create GET /api/inventory route
  - [x] 5.2.2 Create POST /api/inventory/items route
  - [x] 5.2.3 CREATE DELETE /api/inventory/items/{ingredient_name} route
  - [x] 5.2.4 Validate inputs with Pydantic models
  - [x] 5.2.5 Return standardized response format

- [x] 5.3 Create recipe matching endpoint
  - [x] 5.3.1 Create POST /api/recipes/match-inventory route
  - [x] 5.3.2 Implement matching algorithm (exact and partial matches)
  - [x] 5.3.3 Return matched recipes with missing ingredients
  - [x] 5.3.4 Add tests for matching logic

## 6. Frontend - Recipe Generator UI

- [x] 6.1 Create ingredient input component
  - [x] 6.1.1 Build IngredientInput.tsx with add/remove functionality
  - [x] 6.1.2 Add input validation
  - [x] 6.1.3 Style with Tailwind CSS
  - [x] 6.1.4 Add autocomplete for common ingredients

- [x] 6.2 Create preferences form
  - [x] 6.2.1 Build PreferencesForm.tsx with dietary restrictions
  - [x] 6.2.2 Add cuisine type selector
  - [x] 6.2.3 Add difficulty level selector
  - [x] 6.2.4 Style with Tailwind CSS

- [x] 6.3 Create recipe display component
  - [x] 6.3.1 Build GeneratedRecipe.tsx to show recipe details
  - [x] 6.3.2 Display ingredients with quantities
  - [x] 6.3.3 Display step-by-step instructions
  - [x] 6.3.4 Add save recipe functionality
  - [x] 6.3.5 Style with Tailwind CSS

- [x] 6.4 Create recipe generator hook
  - [x] 6.4.1 Build useRecipeGenerator.ts hook
  - [x] 6.4.2 Handle API calls to /api/recipes/generate
  - [x] 6.4.3 Manage loading and error states
  - [x] 6.4.4 Add success notifications

- [x] 6.5 Create generator page
  - [x] 6.5.1 Build Generator.tsx page
  - [x] 6.5.2 Integrate all generator components
  - [x] 6.5.3 Add responsive layout
  - [x] 6.5.4 Add loading spinner during generation

## 7. Frontend - Recipe Search UI

- [x] 7.1 Create search bar component
  - [x] 7.1.1 Build SearchBar.tsx with input field
  - [x] 7.1.2 Add search button and keyboard shortcuts
  - [x] 7.1.3 Add ingredient filter chips
  - [x] 7.1.4 Style with Tailwind CSS

- [x] 7.2 Create recipe card component
  - [x] 7.2.1 Build RecipeCard.tsx for search results
  - [x] 7.2.2 Display recipe image, title, description
  - [x] 7.2.3 Show cooking time and difficulty
  - [x] 7.2.4 Add click handler to view full recipe
  - [x] 7.2.5 Style with Tailwind CSS

- [x] 7.3 Create recipe grid component
  - [x] 7.3.1 Build RecipeGrid.tsx for displaying results
  - [x] 7.3.2 Implement responsive grid layout
  - [x] 7.3.3 Add pagination controls
  - [x] 7.3.4 Handle empty state

- [x] 7.4 Create search hook
  - [x] 7.4.1 Build useRecipeSearch.ts hook
  - [x] 7.4.2 Handle API calls to /api/recipes/search
  - [x] 7.4.3 Manage search state and results
  - [x] 7.4.4 Add debouncing for search input

- [x] 7.5 Create search page
  - [x] 7.5.1 Build Search.tsx page
  - [x] 7.5.2 Integrate search components
  - [x] 7.5.3 Add responsive layout
  - [x] 7.5.4 Add loading and error states

## 8. Frontend - Inventory Management UI

- [x] 8.1 Create inventory list component
  - [x] 8.1.1 Build InventoryList.tsx to display items
  - [x] 8.1.2 Add remove item functionality
  - [x] 8.1.3 Show item quantities
  - [x] 8.1.4 Style with Tailwind CSS

- [x] 8.2 Create add ingredient component
  - [x] 8.2.1 Build AddIngredient.tsx with input form
  - [x] 8.2.2 Add quantity input (optional)
  - [x] 8.2.3 Add validation
  - [x] 8.2.4 Style with Tailwind CSS

- [x] 8.3 Create recipe matches component
  - [x] 8.3.1 Build RecipeMatches.tsx to show matching recipes
  - [x] 8.3.2 Display exact matches section
  - [x] 8.3.3 Display partial matches with missing ingredients
  - [x] 8.3.4 Style with Tailwind CSS

- [x] 8.4 Create inventory hook
  - [x] 8.4.1 Build useInventory.ts hook
  - [x] 8.4.2 Handle API calls for inventory operations
  - [x] 8.4.3 Manage inventory state
  - [x] 8.4.4 Add optimistic updates

- [x] 8.5 Create inventory page
  - [x] 8.5.1 Build Inventory.tsx page
  - [x] 8.5.2 Integrate inventory components
  - [x] 8.5.3 Add responsive layout
  - [x] 8.5.4 Add loading and error states

## 9. Testing

- [~] 9.1 Backend unit tests
  - [~] 9.1.1 Write tests for all service classes
  - [~] 9.1.2 Write tests for all API endpoints
  - [~] 9.1.3 Achieve 80%+ code coverage
  - [~] 9.1.4 Mock all LLM, Supabase, and Pinecone calls

- [~] 9.2 Frontend unit tests
  - [~] 9.2.1 Write tests for all components
  - [~] 9.2.2 Write tests for all hooks
  - [~] 9.2.3 Mock API calls
  - [~] 9.2.4 Achieve 70%+ code coverage

- [~] 9.3 Integration tests
  - [~] 9.3.1 Test end-to-end recipe generation flow
  - [~] 9.3.2 Test end-to-end search flow
  - [~] 9.3.3 Test end-to-end inventory flow

## 10. Deployment

- [~] 10.1 Create Dockerfiles
  - [~] 10.1.1 Create backend/Dockerfile
  - [~] 10.1.2 Create frontend/Dockerfile
  - [~] 10.1.3 Optimize image sizes
  - [~] 10.1.4 Add health checks

- [~] 10.2 Prepare for Render and Vercel
  - [~] 10.2.1 Create apprunner.yaml configuration
  - [~] 10.2.2 Set up environment variables (Supabase, Pinecone, Hugging Face)
  - [~] 10.2.3 Configure auto-scaling settings
  - [~] 10.2.4 Set up health checks

- [~] 10.3 Set up Supabase database
  - [~] 10.3.1 Create recipes table with indexes
  - [~] 10.3.2 Create inventory table
  - [~] 10.3.3 Configure Row Level Security (RLS)
  - [~] 10.3.4 Set up database backups

- [~] 10.4 Set up Pinecone index
  - [~] 10.4.1 Create Pinecone index for recipe embeddings
  - [~] 10.4.2 Configure index dimensions and metric
  - [~] 10.4.3 Set up index metadata filtering
  - [~] 10.4.4 Test index performance

- [ ] 10.5 Deploy to App Runner
  - [ ] 10.5.1 Deploy backend service
  - [ ] 10.5.2 Deploy frontend service
  - [ ] 10.5.3 Configure custom domain (optional)
  - [ ] 10.5.4 Test production deployment
