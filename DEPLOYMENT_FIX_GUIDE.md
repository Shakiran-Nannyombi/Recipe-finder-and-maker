# Deployment Fix Guide - Authentication Issues

## Problem Summary
Your deployed app is showing "Failed to create account. Please try again." This is caused by:

1. **Frontend API URL mismatch** - Fixed in code
2. **Supabase inventory table schema mismatch** - Needs database update
3. **Missing environment variables** - Needs verification

## Step 1: Fix Supabase Database Schema

The inventory table schema doesn't match what the application code expects. You need to run the migration.

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://app.supabase.com/project/sdjeiojlkvanhjleidqm
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `supabase_migration_fix_inventory.sql`
5. Click "Run" to execute the migration

### Option B: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.sdjeiojlkvanhjleidqm.supabase.co:5432/postgres" < supabase_migration_fix_inventory.sql
```

## Step 2: Verify Supabase Users Table

Make sure the `users` table exists in your Supabase database:

1. Go to Supabase Dashboard → Table Editor
2. Check if the `users` table exists
3. If not, run the full `supabase_schema.sql` in SQL Editor

## Step 3: Update Frontend Environment Variables on Vercel

The frontend code has been fixed to use `VITE_API_BASE_URL` instead of `VITE_API_URL`.

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project (recipeaiug)
3. Go to Settings → Environment Variables
4. Make sure you have:
   - **Variable Name**: `VITE_API_BASE_URL`
   - **Value**: Your backend URL (e.g., `https://recipe-ai-og2y.onrender.com`)
5. If you had `VITE_API_URL`, delete it and add `VITE_API_BASE_URL` instead

## Step 4: Verify Backend Environment Variables on Render

1. Go to your Render dashboard: https://dashboard.render.com/
2. Select your backend service (recipe-ai-backend)
3. Go to Environment tab
4. Verify these variables are set:
   - `SUPABASE_URL`: https://sdjeiojlkvanhjleidqm.supabase.co
   - `SUPABASE_KEY`: Your Supabase anon key
   - `JWT_SECRET`: A secure random string (at least 32 characters)
   - `CORS_ORIGINS`: Should include your Vercel frontend URL (https://recipeaiug.vercel.app)
   - `GROQ_API_KEY`: Your Groq API key
   - `PINECONE_API_KEY`: Your Pinecone API key

## Step 5: Redeploy

### Redeploy Frontend (Vercel)
1. Go to Vercel dashboard → Your project
2. Go to Deployments tab
3. Click the three dots on the latest deployment
4. Click "Redeploy"

OR push the code changes:
```bash
cd frontend
git add .
git commit -m "Fix API URL environment variable"
git push
```

### Redeploy Backend (Render)
1. Go to Render dashboard → Your service
2. Click "Manual Deploy" → "Deploy latest commit"

OR push the code changes:
```bash
git add .
git commit -m "Fix Supabase schema and API configuration"
git push
```

## Step 6: Test the Deployment

1. Open your deployed frontend: https://recipeaiug.vercel.app
2. Try to sign up with a new account
3. Check browser console (F12) for any errors
4. If you see CORS errors, verify Step 4 (CORS_ORIGINS)

## Common Issues and Solutions

### Issue: "CORS policy" error in browser console
**Solution**: Add your Vercel URL to `CORS_ORIGINS` in Render backend environment variables

### Issue: "Could not connect to Supabase"
**Solution**: Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct in Render

### Issue: "Failed to create user" 
**Solution**: 
- Check if users table exists in Supabase
- Verify RLS policies allow inserts
- Check backend logs in Render for detailed error

### Issue: Still getting "Failed to create account"
**Solution**: 
1. Check Render logs: Dashboard → Your service → Logs
2. Look for Python errors or stack traces
3. Common causes:
   - Missing JWT_SECRET
   - Supabase connection issues
   - Schema mismatch (run migration)

## Verification Checklist

- [ ] Supabase migration executed successfully
- [ ] Users table exists in Supabase
- [ ] Frontend environment variable `VITE_API_BASE_URL` is set on Vercel
- [ ] Backend environment variables are set on Render (especially JWT_SECRET)
- [ ] CORS_ORIGINS includes your Vercel URL
- [ ] Frontend redeployed
- [ ] Backend redeployed
- [ ] Can sign up successfully
- [ ] Can log in successfully

## Need More Help?

If you're still experiencing issues after following these steps:

1. Check Render backend logs for specific error messages
2. Check browser console (F12) for frontend errors
3. Test the backend API directly:
   ```bash
   curl -X POST https://recipe-ai-og2y.onrender.com/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"testpass123"}'
   ```
