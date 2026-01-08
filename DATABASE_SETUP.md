# Database Analytics Integration Setup

This guide explains how to connect your database to display show analytics on show pages.

## Current Implementation

The analytics system is set up with a flexible API structure that can work with any database. The endpoint is located at:

- `/api/analytics/show/[slug]` - Fetches analytics for a specific show

## Database Options

You can use any of the following databases:

### Option 1: PostgreSQL (Vercel Postgres, Supabase, etc.)

```typescript
// Example using Vercel Postgres
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const show = getShowBySlug(slug);
  
  const analytics = await sql`
    SELECT 
      SUM(views) as total_views,
      COUNT(*) as total_episodes,
      AVG(views) as avg_views,
      MAX(views) as latest_episode_views
    FROM episodes
    WHERE show_id = ${show.id}
  `;
  
  // Format and return data
}
```

### Option 2: MongoDB

```typescript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  await client.connect();
  const db = client.db('luckystudios');
  const episodes = db.collection('episodes');
  
  const analytics = await episodes.aggregate([
    { $match: { showId: show.id } },
    {
      $group: {
        _id: null,
        totalViews: { $sum: '$views' },
        totalEpisodes: { $count: {} },
        avgViews: { $avg: '$views' },
      }
    }
  ]).toArray();
  
  // Format and return data
}
```

### Option 3: Prisma ORM

```typescript
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const show = getShowBySlug(slug);
  
  const analytics = await prisma.showAnalytics.findUnique({
    where: { showId: show.id },
    include: {
      episodes: {
        orderBy: { views: 'desc' },
        take: 5,
      }
    }
  });
  
  // Format and return data
}
```

### Option 4: Supabase

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const show = getShowBySlug(slug);
  
  const { data: analytics } = await supabase
    .from('episodes')
    .select('views, title, release_date')
    .eq('show_id', show.id)
    .order('views', { ascending: false })
    .limit(5);
  
  // Format and return data
}
```

## Data Structure

The API expects to return data in this format:

```typescript
interface ShowAnalytics {
  totalViews: number;
  totalEpisodes: number;
  averageViewsPerEpisode: number;
  latestEpisodeViews: number;
  growthRate: number; // Percentage
  topEpisodes: Array<{
    title: string;
    views: number;
    date: string; // ISO date string
  }>;
  demographics?: {
    ageGroups: Record<string, number>;
    countries: Record<string, number>;
  };
}
```

## Implementation Steps

1. **Choose your database** and install the necessary packages:
   ```bash
   npm install @vercel/postgres
   # or
   npm install mongodb
   # or
   npm install @prisma/client
   # or
   npm install @supabase/supabase-js
   ```

2. **Update the API route** at `app/api/analytics/show/[slug]/route.ts`:
   - Replace the mock data section with your database query
   - Format the results to match the `ShowAnalytics` interface

3. **Add environment variables** to `.env.local`:
   ```env
   DATABASE_URL=your_connection_string
   # or specific variables for your database
   ```

4. **Test the endpoint**:
   ```bash
   curl http://localhost:3000/api/analytics/show/back-post
   ```

## Example Database Schema

If you're creating a new database, here's a suggested schema:

### Episodes Table
```sql
CREATE TABLE episodes (
  id SERIAL PRIMARY KEY,
  show_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  episode_number INTEGER,
  views INTEGER DEFAULT 0,
  release_date DATE,
  duration_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_episodes_show_id ON episodes(show_id);
CREATE INDEX idx_episodes_views ON episodes(views DESC);
```

### Analytics Table (Optional - for aggregated data)
```sql
CREATE TABLE show_analytics (
  show_id VARCHAR(255) PRIMARY KEY,
  total_views INTEGER DEFAULT 0,
  total_episodes INTEGER DEFAULT 0,
  average_views DECIMAL(10, 2),
  growth_rate DECIMAL(5, 2),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Caching

The analytics endpoint includes caching headers:
- Cache for 5 minutes
- Stale-while-revalidate for 10 minutes

Adjust these in the API route if needed.

## Notes

- The analytics component will automatically hide if no data is available
- All analytics are displayed with formatted numbers (K, M suffixes)
- The component gracefully handles loading and error states

