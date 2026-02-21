# Supabase Setup Guide - Recipe AI

This guide will help you set up Supabase for Recipe AI.

---

## Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - Name: `recipe-ai` (or your preferred name)
   - Database Password: (create a strong password)
   - Region: Choose closest to your users
4. Click "Create new project"
5. Wait for project to be provisioned (2-3 minutes)

---

## Step 2: Get Your Credentials

### Project URL and Keys

1. Go to Project Settings → API
2. Copy the following:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Project ID**: Found in the URL or settings
   - **anon/public key**: Under "Project API keys"

### Example Values

```
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_PROJECT_ID=abcdefghijklmnop
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 3: Create Database Schema

1. Go to SQL Editor in Supabase Dashboard
2. Click "New Query"
3. Copy the contents of `supabase_schema.sql` from the project root
4. Paste into the SQL Editor
5. Click "Run" to execute

This will create:
- `recipes` table
- `user_inventory` table
- `recipe_matches` table
- Necessary indexes and constraints

---

## Step 4: Configure Environment Variables

### Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```bash
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_PROJECT_ID=your-project-id
   SUPABASE_KEY=your-anon-key
   ```

### Render (Production)

1. Go to Render Dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add environment variables:
   - `SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `SUPABASE_KEY` = `your-anon-key`

Note: `SUPABASE_PROJECT_ID` is optional for production if not used in code.

---

## Step 5: Enable Row Level Security (RLS)

For production security, enable RLS on your tables:

1. Go to Authentication → Policies
2. For each table (`recipes`, `user_inventory`, `recipe_matches`):
   - Click "Enable RLS"
   - Add policies as needed

### Example Policy (Allow All for Development)

```sql
-- Allow all operations for development
CREATE POLICY "Allow all" ON recipes
FOR ALL
USING (true)
WITH CHECK (true);
```

### Production Policies (Recommended)

```sql
-- Allow authenticated users to read all recipes
CREATE POLICY "Allow read recipes" ON recipes
FOR SELECT
USING (true);

-- Allow authenticated users to manage their own inventory
CREATE POLICY "Allow manage own inventory" ON user_inventory
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

---

## Step 6: Test Connection

### Test Locally

```bash
cd backend
python -c "
from services.supabase_service import get_supabase_client
client = get_supabase_client()
print('Supabase connected successfully!')
"
```

### Test via API

```bash
# Start backend
cd backend
uvicorn main:app --reload

# Test health endpoint
curl http://localhost:8000/health
```

---

## Troubleshooting

### Connection Errors

**Error**: `Invalid API key`
- **Solution**: Check that `SUPABASE_KEY` is the anon/public key, not the service role key

**Error**: `Project not found`
- **Solution**: Verify `SUPABASE_URL` matches your project URL exactly

**Error**: `SSL certificate verification failed`
- **Solution**: Update your Python packages: `pip install --upgrade certifi`

### Database Errors

**Error**: `relation "recipes" does not exist`
- **Solution**: Run the SQL schema from `supabase_schema.sql`

**Error**: `permission denied for table recipes`
- **Solution**: Check RLS policies or disable RLS for development

---

## Database Schema Overview

### Tables

1. **recipes**
   - `id` (uuid, primary key)
   - `title` (text)
   - `description` (text)
   - `ingredients` (jsonb)
   - `instructions` (jsonb)
   - `prep_time` (integer)
   - `cook_time` (integer)
   - `servings` (integer)
   - `difficulty` (text)
   - `cuisine_type` (text)
   - `dietary_restrictions` (jsonb)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

2. **user_inventory**
   - `id` (uuid, primary key)
   - `user_id` (uuid)
   - `ingredient_name` (text)
   - `quantity` (numeric)
   - `unit` (text)
   - `expiry_date` (date)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

3. **recipe_matches**
   - `id` (uuid, primary key)
   - `user_id` (uuid)
   - `recipe_id` (uuid, foreign key)
   - `match_percentage` (numeric)
   - `missing_ingredients` (jsonb)
   - `created_at` (timestamp)

---

## Supabase Features Used

### Database
- PostgreSQL database for storing recipes and inventory
- JSONB columns for flexible data structures
- Foreign key relationships

### Storage (Optional)
- Can be used to store recipe images
- Configure in Supabase Dashboard → Storage

### Authentication (Future)
- Can add user authentication
- Integrate with Supabase Auth

---

## Cost Considerations

### Free Tier Includes
- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth
- 50,000 monthly active users

### Monitoring Usage
1. Go to Project Settings → Usage
2. Monitor database size and bandwidth
3. Upgrade plan if needed

---

## Backup and Maintenance

### Automatic Backups
- Supabase provides automatic daily backups
- Available in Project Settings → Database → Backups

### Manual Backup
```bash
# Export data via SQL
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Python Client](https://github.com/supabase-community/supabase-py)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Setup Complete!** Your Supabase database is ready for Recipe AI.
