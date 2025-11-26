# Vercel KV Database Setup

This project now uses **Vercel KV** (Redis) for persistent data storage instead of localStorage.

## Benefits

✅ **Persistent**: Data survives browser cache clears and works across all devices  
✅ **Fast**: Redis-based key-value store for instant access  
✅ **Free**: Generous free tier on Vercel  
✅ **Sync**: All users see the same data  
✅ **Shared**: Custom agents and URL overrides available to all users  

## Setup Instructions

### Automatic Setup (Recommended)

1. **Push code to GitHub** (Already done ✅)
   
2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Enable Vercel KV** in Vercel Dashboard:
   - Go to https://vercel.com/dashboard
   - Select your project: `ft-agent-studio`
   - Click on **"Storage"** tab
   - Click **"Create Database"**
   - Select **"KV"** (Redis)
   - Click **"Continue"**
   - Name it: `ft-agent-studio-kv`
   - Select region closest to you
   - Click **"Create"**
   - Vercel will automatically add environment variables:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
     - `KV_REST_API_READ_ONLY_TOKEN`
   - Click **"Connect Project"** to link it to your deployment

4. **Redeploy** (automatic)
   - Vercel will automatically trigger a new deployment
   - Your app will now use the database!

## Data Structure

The database stores:

1. **`customAgents`** (Array): Custom agents created by users
2. **`agentOverrides`** (Object): Modifications to default agents (URLs, descriptions, etc.)

## API Endpoints

- **GET `/api/agents`** - Fetch all agents (default + custom + overrides)
- **POST `/api/agents`** - Add new custom agent
- **PUT `/api/agents`** - Update an agent
- **DELETE `/api/agents?id=<id>`** - Delete custom agent
- **DELETE `/api/agents?id=<id>&reset=true`** - Reset default agent to original

## Pricing

**Vercel KV Free Tier:**
- 256 MB storage
- 3,000 commands per day
- Perfect for this use case!

For more usage: https://vercel.com/pricing/storage#kv

## Testing Locally

To test locally with Vercel KV:

```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull .env.local

# Run locally
npm run dev
```

## Fallback

If KV is not set up, the API will return errors. The UI will handle this gracefully.

## Troubleshooting

**Issue**: "Failed to fetch agents"  
**Solution**: Make sure Vercel KV is created and connected in the Vercel dashboard

**Issue**: API returns 500 errors  
**Solution**: Check that environment variables are set correctly in Vercel settings

**Issue**: Local dev doesn't work  
**Solution**: Run `vercel env pull .env.local` to get the KV credentials locally
