# Vercel Postgres Database Setup

This app uses **Vercel Postgres** for persistent storage. No more localStorage - all data is stored in a real database!

## ✅ Benefits

- **Persistent**: Data never disappears, survives cache clears
- **Synced**: All devices and users see the same data
- **Fast**: PostgreSQL with connection pooling
- **Free**: Generous free tier on Vercel
- **Professional**: Real database with SQL

## 🚀 Setup Instructions

### Step 1: Create Postgres Database on Vercel

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your project: **`ft-agent-studio`**
3. Click **"Storage"** tab in the left sidebar
4. Click **"Create Database"**
5. Select **"Postgres"**
6. Configure:
   - **Name**: `ft-agent-studio-db`
   - **Region**: Select closest to you (e.g., US East)
7. Click **"Create"**
8. Click **"Connect Project"** to link the database
9. Done! Vercel will automatically:
   - Add environment variables (`POSTGRES_URL`, etc.)
   - Trigger a new deployment
   - Initialize the database tables

### Step 2: Verify It's Working

1. Wait for the deployment to complete (~1-2 minutes)
2. Open your app: `https://ft-agent-studio.vercel.app`
3. The app will automatically create the tables on first load
4. Try adding a custom agent in Settings
5. Refresh the page - your agent should still be there! ✅

## 📊 Database Schema

The app creates two tables automatically:

### `custom_agents` Table
Stores user-created custom agents.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT | Primary key (e.g., "custom-1638360000000") |
| `name` | TEXT | Agent name |
| `slug` | TEXT | URL-friendly name |
| `description` | TEXT | What the agent does |
| `category` | TEXT | Category (Planning, Tracking, etc.) |
| `tags` | JSONB | Array of tags |
| `status` | TEXT | Live, Beta, or Experimental |
| `vercel_url` | TEXT | Agent's URL |
| `image_url` | TEXT | Card image URL |
| `last_updated` | TEXT | Last update date |
| `primary_action_label` | TEXT | Button text |
| `created_at` | TIMESTAMP | When created |

### `agent_overrides` Table
Stores modifications to default agents.

| Column | Type | Description |
|--------|------|-------------|
| `agent_id` | TEXT | Primary key (references default agent ID) |
| `name` | TEXT | Override name (nullable) |
| `description` | TEXT | Override description (nullable) |
| `category` | TEXT | Override category (nullable) |
| `tags` | JSONB | Override tags (nullable) |
| `status` | TEXT | Override status (nullable) |
| `vercel_url` | TEXT | Override URL (nullable) |
| `image_url` | TEXT | Override image (nullable) |
| `primary_action_label` | TEXT | Override button text (nullable) |
| `updated_at` | TIMESTAMP | When last updated |

## 🔄 API Endpoints

All endpoints use `/api/agents`:

- **`GET /api/agents`** - Fetch all agents (default + custom + overrides)
- **`POST /api/agents`** - Add a new custom agent
- **`PUT /api/agents`** - Update an agent (custom or default override)
- **`DELETE /api/agents?id={id}`** - Delete a custom agent
- **`DELETE /api/agents?id={id}&reset=true`** - Reset a default agent override

## 💰 Pricing

**Vercel Postgres Free Tier:**
- ✅ 256 MB storage
- ✅ 60 hours compute per month
- ✅ Perfect for this app!

Upgrade available if needed: https://vercel.com/pricing/storage#postgres

## 🧪 Testing Locally

To test with the real database locally:

```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Pull environment variables from Vercel
vercel env pull .env.local

# Run dev server
npm run dev
```

The app will connect to the same Vercel Postgres database.

## 🔧 Troubleshooting

### Issue: "Failed to fetch agents"
**Solution**: 
1. Make sure Vercel Postgres is created and connected
2. Check deployment logs for errors
3. Verify environment variables are set in Vercel

### Issue: Tables don't exist
**Solution**: 
The tables are auto-created on first API call. If they don't exist:
1. Check API route logs in Vercel
2. The `initDB()` function runs automatically
3. If needed, you can manually create tables using SQL in Vercel dashboard

### Issue: Local dev doesn't work
**Solution**: 
Run `vercel env pull .env.local` to get database credentials locally

### Issue: Want to reset database
**Solution**:
In Vercel Dashboard > Storage > Your Database > Data tab:
```sql
DROP TABLE IF EXISTS custom_agents;
DROP TABLE IF EXISTS agent_overrides;
```
Then redeploy to recreate tables.

## 🎉 What Changed

### Before (localStorage):
- ❌ Data lost on cache clear
- ❌ Different data on each device
- ❌ Limited to single browser
- ❌ Not shareable

### After (Postgres):
- ✅ Data persists forever
- ✅ Same data everywhere
- ✅ Works across all devices
- ✅ Professional database

## 📝 Migration Notes

If you had data in localStorage before:
- Old localStorage data will NOT be automatically migrated
- You'll need to recreate custom agents in the Settings page
- Default agents will work immediately
- This is a one-time setup

---

**Need help?** Check Vercel Postgres docs: https://vercel.com/docs/storage/vercel-postgres
