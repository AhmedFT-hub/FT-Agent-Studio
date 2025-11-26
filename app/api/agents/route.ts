import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { agents as defaultAgents } from '@/lib/data';
import type { Agent } from '@/lib/types';

// GET - Fetch all agents (default + custom + overrides)
export async function GET() {
  try {
    // Get custom agents and overrides from KV
    const customAgents = await kv.get<Agent[]>('customAgents') || [];
    const agentOverrides = await kv.get<Record<string, Partial<Agent>>>('agentOverrides') || {};

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
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

// POST - Add a new custom agent
export async function POST(request: Request) {
  try {
    const newAgent = await request.json();
    
    // Validate required fields
    if (!newAgent.name || !newAgent.description || !newAgent.vercelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields (name, description, vercelUrl)' },
        { status: 400 }
      );
    }

    // Get existing custom agents
    const customAgents = await kv.get<Agent[]>('customAgents') || [];

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

    // Add to custom agents
    const updatedAgents = [...customAgents, agent];
    await kv.set('customAgents', updatedAgents);

    return NextResponse.json({ success: true, agent });
  } catch (error) {
    console.error('Error adding agent:', error);
    return NextResponse.json(
      { error: 'Failed to add agent' },
      { status: 500 }
    );
  }
}

// PUT - Update an agent (custom or override default)
export async function PUT(request: Request) {
  try {
    const { id, updates, isDefault } = await request.json();

    if (isDefault) {
      // Update a default agent (store as override)
      const agentOverrides = await kv.get<Record<string, Partial<Agent>>>('agentOverrides') || {};
      agentOverrides[id] = updates;
      await kv.set('agentOverrides', agentOverrides);
    } else {
      // Update a custom agent
      const customAgents = await kv.get<Agent[]>('customAgents') || [];
      const updatedAgents = customAgents.map(agent => 
        agent.id === id ? { ...agent, ...updates } : agent
      );
      await kv.set('customAgents', updatedAgents);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an agent
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const isReset = searchParams.get('reset') === 'true';

    if (!id) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    if (isReset) {
      // Reset a default agent override
      const agentOverrides = await kv.get<Record<string, Partial<Agent>>>('agentOverrides') || {};
      delete agentOverrides[id];
      await kv.set('agentOverrides', agentOverrides);
    } else {
      // Delete a custom agent
      const customAgents = await kv.get<Agent[]>('customAgents') || [];
      const updatedAgents = customAgents.filter(agent => agent.id !== id);
      await kv.set('customAgents', updatedAgents);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
