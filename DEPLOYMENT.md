# Recipe AI Deployment Guide

## Overview
This guide covers deploying Recipe AI with:
- Backend: Render
- Frontend: Vercel
- Database: Supabase
- Vector Search: Pinecone
- LLM: Hugging Face

## Prerequisites

1. Accounts on:
   - Render (https://render.com)
   - Vercel (https://vercel.com)
   - Supabase (https://supabase.com)
   - Pinecone (https://www.pinecone.io)
   - Hugging Face (https://huggingface.co)

2. Environment variables ready:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `PINECONE_API_KEY`
   - `PINECONE_ENVIRONMENT`
   - `HF_API_TOKEN` (optional, for gated models)

## Step 1: Set up Supabase Database

1. Create a new Supabase project
2. Go to SQL Editor
3. Run the schema from `supabase_schema.sql`
4. Note your project URL and anon key

## Step 2: Set up Pinecone Index

1. Create a new Pinecone project
2. Create an index with:
   - Name: `recipes`
   - Dimensions: `384` (for sentence-transformers/all-MiniLM-L6-v2)
   - Metric: `cosine`
   - Pod Type: `s1` or `p1` (based on your plan)
3. Note your API key and environment

## Step 3: Deploy Backend to Render

1. Push your code to GitHub
2. Go to Render Dashboard
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - Name: `recipe-ai-backend`
   - Root Directory: `backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `PINECONE_API_KEY`
   - `PINECONE_ENVIRONMENT`
   - `HF_MODEL_NAME` = `meta-llama/Llama-2-7b-chat-hf`
   - `HF_API_TOKEN` (if needed)
   - `FRONTEND_URL` (will be set after frontend deployment)
7. Click "Create Web Service"
8. Note your backend URL (e.g., `https://recipe-ai-backend.onrender.com`)

## Step 4: Deploy Frontend to Vercel

1. Go to Vercel Dashboard
2. Click "Add New..." → "Project"
3. Import your repository
4. Configure:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable:
   - `VITE_API_URL` = Your Render backend URL
6. Click "Deploy"
7. Note your frontend URL

## Step 5: Update CORS Configuration

1. Go back to Render
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy the backend service

## Step 6: Test the Deployment

1. Visit your Vercel frontend URL
2. Test recipe generation
3. Test recipe search
4. Test inventory management

## Monitoring and Maintenance

### Render
- View logs in Render Dashboard
- Monitor resource usage
- Set up alerts for downtime

### Vercel
- View deployment logs
- Monitor function execution
- Check analytics

### Supabase
- Monitor database usage
- Check query performance
- Review RLS policies

### Pinecone
- Monitor index usage
- Check query latency
- Review vector count

## Troubleshooting

### Backend Issues
- Check Render logs for errors
- Verify environment variables
- Test health endpoint: `https://your-backend.onrender.com/health`

### Frontend Issues
- Check Vercel deployment logs
- Verify API URL is correct
- Check browser console for errors

### Database Issues
- Verify Supabase connection
- Check RLS policies
- Review query logs

### Vector Search Issues
- Verify Pinecone API key
- Check index exists
- Verify embedding dimensions match

## Scaling Considerations

### Backend (Render)
- Upgrade to higher tier for more resources
- Enable auto-scaling
- Consider using Redis for caching

### Frontend (Vercel)
- Automatic scaling included
- Monitor function execution time
- Optimize bundle size

### Database (Supabase)
- Upgrade plan for more connections
- Add read replicas if needed
- Optimize queries with indexes

### Vector Search (Pinecone)
- Upgrade to higher tier for more QPS
- Consider using metadata filtering
- Monitor query latency

## Cost Optimization

1. **Render**: Start with Starter plan ($7/month)
2. **Vercel**: Free tier for hobby projects
3. **Supabase**: Free tier includes 500MB database
4. **Pinecone**: Free tier includes 1 index with 100K vectors

## Security Best Practices

1. Never commit API keys to version control
2. Use environment variables for all secrets
3. Enable RLS on Supabase tables
4. Restrict CORS to your frontend domain
5. Use HTTPS for all connections
6. Regularly update dependencies
7. Monitor for security vulnerabilities

## Backup Strategy

1. **Database**: Supabase provides automatic backups
2. **Code**: Keep in version control (GitHub)
3. **Environment Variables**: Document in secure location
4. **Pinecone**: Export vectors periodically

## Support

For issues:
1. Check logs in respective platforms
2. Review documentation
3. Contact platform support if needed
