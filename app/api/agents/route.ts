import { NextResponse } from 'next/server';
import { agents as defaultAgents } from '@/lib/data';
import type { Agent } from '@/lib/types';
import {
  initDB,
  getCustomAgents,
  getAgentOverrides,
  addCustomAgent,
  updateCustomAgent,
  deleteCustomAgent,
  upsertAgentOverride,
  deleteAgentOverride,
} from '@/lib/db';

// Initialize database on first request
let dbInitialized = false;

async function ensureDB() {
  if (!dbInitialized) {
    await initDB();
    dbInitialized = true;
  }
}

// GET - Fetch all agents (default + custom + overrides)
export async function GET() {
  try {
    await ensureDB();
    
    const customAgents = await getCustomAgents();
    const agentOverrides = await getAgentOverrides();

    // Merge default agents with overrides
    const defaultAgentsWithOverrides = defaultAgents.map(agent => ({
      ...agent,
      ...agentOverrides[agent.id]
    }));

    return NextResponse.json({
      agents: [...defaultAgentsWithOverrides, ...customAgents],
      customAgents,
      agentOverrides
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents', details: String(error) },
      { status: 500 }
    );
  }
}

// POST - Add a new custom agent
export async function POST(request: Request) {
  try {
    await ensureDB();
    
    const newAgent = await request.json();
    
    // Validate required fields
    if (!newAgent.name || !newAgent.description || !newAgent.vercelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields (name, description, vercelUrl)' },
        { status: 400 }
      );
    }

    // Create the agent object
    const agent: Agent = {
      id: `custom-${Date.now()}`,
      name: newAgent.name,
      slug: newAgent.name.toLowerCase().replace(/\s+/g, '-'),
      description: newAgent.description,
      category: newAgent.category || 'Other',
      tags: newAgent.tags || [],
      status: newAgent.status || 'Live',
      vercelUrl: newAgent.vercelUrl,
      imageUrl: newAgent.imageUrl || '/agents/rate-intelligence.svg',
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      primaryActionLabel: newAgent.primaryActionLabel || 'See it in action',
    };

    const result = await addCustomAgent(agent);
    
    if (result.success) {
      return NextResponse.json({ success: true, agent });
    } else {
      return NextResponse.json(
        { error: 'Failed to add agent', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error adding agent:', error);
    return NextResponse.json(
      { error: 'Failed to add agent', details: String(error) },
      { status: 500 }
    );
  }
}

// PUT - Update an agent (custom or override default)
export async function PUT(request: Request) {
  try {
    await ensureDB();
    
    const { id, updates, isDefault } = await request.json();

    if (!id || !updates) {
      return NextResponse.json(
        { error: 'Missing id or updates' },
        { status: 400 }
      );
    }

    let result;
    if (isDefault) {
      // Update a default agent (store as override)
      result = await upsertAgentOverride(id, updates);
    } else {
      // Update a custom agent (slug is calculated in updateCustomAgent)
      result = await updateCustomAgent(id, updates);
    }

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to update agent', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: 'Failed to update agent', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE - Delete an agent or reset override
export async function DELETE(request: Request) {
  try {
    await ensureDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const isReset = searchParams.get('reset') === 'true';

    if (!id) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    let result;
    if (isReset) {
      // Reset a default agent override
      result = await deleteAgentOverride(id);
    } else {
      // Delete a custom agent
      result = await deleteCustomAgent(id);
    }

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete agent', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent', details: String(error) },
      { status: 500 }
    );
  }
}
