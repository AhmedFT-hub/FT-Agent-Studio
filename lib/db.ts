import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function initDB() {
  try {
    // Create custom_agents table
    await sql`
      CREATE TABLE IF NOT EXISTS custom_agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        tags JSONB DEFAULT '[]',
        status TEXT DEFAULT 'Live',
        vercel_url TEXT NOT NULL,
        image_url TEXT,
        last_updated TEXT,
        primary_action_label TEXT DEFAULT 'See it in action',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create agent_overrides table for default agent modifications
    await sql`
      CREATE TABLE IF NOT EXISTS agent_overrides (
        agent_id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        category TEXT,
        tags JSONB,
        status TEXT,
        vercel_url TEXT,
        image_url TEXT,
        primary_action_label TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error };
  }
}

export async function getCustomAgents() {
  try {
    const result = await sql`
      SELECT * FROM custom_agents ORDER BY created_at DESC
    `;
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      category: row.category,
      tags: row.tags || [],
      status: row.status,
      vercelUrl: row.vercel_url,
      imageUrl: row.image_url,
      lastUpdated: row.last_updated,
      primaryActionLabel: row.primary_action_label,
    }));
  } catch (error) {
    console.error('Error fetching custom agents:', error);
    return [];
  }
}

export async function getAgentOverrides() {
  try {
    const result = await sql`
      SELECT * FROM agent_overrides
    `;
    const overrides: Record<string, any> = {};
    result.rows.forEach(row => {
      overrides[row.agent_id] = {
        name: row.name,
        description: row.description,
        category: row.category,
        tags: row.tags,
        status: row.status,
        vercelUrl: row.vercel_url,
        imageUrl: row.image_url,
        primaryActionLabel: row.primary_action_label,
      };
      // Remove null values
      Object.keys(overrides[row.agent_id]).forEach(key => {
        if (overrides[row.agent_id][key] === null) {
          delete overrides[row.agent_id][key];
        }
      });
    });
    return overrides;
  } catch (error) {
    console.error('Error fetching agent overrides:', error);
    return {};
  }
}

export async function addCustomAgent(agent: any) {
  try {
    await sql`
      INSERT INTO custom_agents (
        id, name, slug, description, category, tags, status, 
        vercel_url, image_url, last_updated, primary_action_label
      ) VALUES (
        ${agent.id}, ${agent.name}, ${agent.slug}, ${agent.description},
        ${agent.category}, ${JSON.stringify(agent.tags)}::jsonb, ${agent.status},
        ${agent.vercelUrl}, ${agent.imageUrl}, ${agent.lastUpdated}, ${agent.primaryActionLabel}
      )
    `;
    return { success: true };
  } catch (error) {
    console.error('Error adding custom agent:', error);
    return { success: false, error };
  }
}

export async function updateCustomAgent(id: string, updates: any) {
  try {
    // Simple approach: just update all fields that are provided
    // Using Vercel Postgres template syntax
    
    if (updates.name !== undefined) {
      updates.slug = updates.name.toLowerCase().replace(/\s+/g, '-');
    }
    
    await sql`
      UPDATE custom_agents SET
        name = COALESCE(${updates.name}, name),
        slug = COALESCE(${updates.slug}, slug),
        description = COALESCE(${updates.description}, description),
        category = COALESCE(${updates.category}, category),
        tags = COALESCE(${JSON.stringify(updates.tags || null)}::jsonb, tags),
        status = COALESCE(${updates.status}, status),
        vercel_url = COALESCE(${updates.vercelUrl}, vercel_url),
        image_url = COALESCE(${updates.imageUrl}, image_url),
        primary_action_label = COALESCE(${updates.primaryActionLabel}, primary_action_label)
      WHERE id = ${id}
    `;
    
    return { success: true };
  } catch (error) {
    console.error('Error updating custom agent:', error);
    return { success: false, error };
  }
}

export async function deleteCustomAgent(id: string) {
  try {
    await sql`
      DELETE FROM custom_agents WHERE id = ${id}
    `;
    return { success: true };
  } catch (error) {
    console.error('Error deleting custom agent:', error);
    return { success: false, error };
  }
}

export async function upsertAgentOverride(agentId: string, updates: any) {
  try {
    // Insert or update agent override
    await sql`
      INSERT INTO agent_overrides (
        agent_id, name, description, category, tags, status,
        vercel_url, image_url, primary_action_label
      ) VALUES (
        ${agentId}, 
        ${updates.name || null}, 
        ${updates.description || null}, 
        ${updates.category || null},
        ${JSON.stringify(updates.tags || null)}::jsonb, 
        ${updates.status || null},
        ${updates.vercelUrl || null}, 
        ${updates.imageUrl || null}, 
        ${updates.primaryActionLabel || null}
      )
      ON CONFLICT (agent_id) DO UPDATE SET
        name = COALESCE(EXCLUDED.name, agent_overrides.name),
        description = COALESCE(EXCLUDED.description, agent_overrides.description),
        category = COALESCE(EXCLUDED.category, agent_overrides.category),
        tags = COALESCE(EXCLUDED.tags, agent_overrides.tags),
        status = COALESCE(EXCLUDED.status, agent_overrides.status),
        vercel_url = COALESCE(EXCLUDED.vercel_url, agent_overrides.vercel_url),
        image_url = COALESCE(EXCLUDED.image_url, agent_overrides.image_url),
        primary_action_label = COALESCE(EXCLUDED.primary_action_label, agent_overrides.primary_action_label),
        updated_at = NOW()
    `;
    
    return { success: true };
  } catch (error) {
    console.error('Error upserting agent override:', error);
    return { success: false, error };
  }
}

export async function deleteAgentOverride(agentId: string) {
  try {
    await sql`
      DELETE FROM agent_overrides WHERE agent_id = ${agentId}
    `;
    return { success: true };
  } catch (error) {
    console.error('Error deleting agent override:', error);
    return { success: false, error };
  }
}
