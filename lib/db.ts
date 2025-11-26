import { sql } from '@vercel/postgres';

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
    await sql`
      UPDATE custom_agents SET
        name = ${updates.name},
        slug = ${updates.slug},
        description = ${updates.description},
        category = ${updates.category},
        tags = ${JSON.stringify(updates.tags)}::jsonb,
        status = ${updates.status},
        vercel_url = ${updates.vercelUrl},
        image_url = ${updates.imageUrl},
        primary_action_label = ${updates.primaryActionLabel}
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
    await sql`
      INSERT INTO agent_overrides (
        agent_id, name, description, category, tags, status,
        vercel_url, image_url, primary_action_label
      ) VALUES (
        ${agentId}, ${updates.name}, ${updates.description}, ${updates.category},
        ${JSON.stringify(updates.tags)}::jsonb, ${updates.status},
        ${updates.vercelUrl}, ${updates.imageUrl}, ${updates.primaryActionLabel}
      )
      ON CONFLICT (agent_id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        tags = EXCLUDED.tags,
        status = EXCLUDED.status,
        vercel_url = EXCLUDED.vercel_url,
        image_url = EXCLUDED.image_url,
        primary_action_label = EXCLUDED.primary_action_label,
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
