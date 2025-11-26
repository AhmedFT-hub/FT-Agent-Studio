"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Save, Edit2, X, Upload, Loader2 } from "lucide-react";
import { Agent } from "@/lib/types";
import { agents as defaultAgents } from "@/lib/data";

export default function SettingsPage() {
  const router = useRouter();
  const [customAgents, setCustomAgents] = useState<Agent[]>([]);
  const [agentOverrides, setAgentOverrides] = useState<Record<string, Partial<Agent>>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isEditingDefault, setIsEditingDefault] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: "",
    description: "",
    category: "Other",
    tags: [],
    status: "Live",
    vercelUrl: "",
    imageUrl: "/agents/rate-intelligence.svg",
    primaryActionLabel: "See it in action",
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    // Fetch agents from database
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      if (response.ok) {
        const data = await response.json();
        setCustomAgents(data.customAgents);
        setAgentOverrides(data.agentOverrides);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleAddAgent = async () => {
    if (!newAgent.name || !newAgent.description || !newAgent.vercelUrl) {
      alert("Please fill in all required fields (Name, Description, URL)");
      return;
    }

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAgent),
      });

      if (response.ok) {
        await fetchAgents();
        setIsAdding(false);
        setNewAgent({
          name: "",
          description: "",
          category: "Other",
          tags: [],
          status: "Live",
          vercelUrl: "",
          imageUrl: "/agents/rate-intelligence.svg",
          primaryActionLabel: "See it in action",
        });
        setTagInput("");
        alert("Agent added successfully!");
      } else {
        alert("Failed to add agent");
      }
    } catch (error) {
      console.error('Error adding agent:', error);
      alert("Failed to add agent");
    }
  };

  const handleDeleteAgent = async (id: string) => {
    if (confirm("Are you sure you want to delete this agent?")) {
      try {
        const response = await fetch(`/api/agents?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchAgents();
          alert("Agent deleted successfully!");
        } else {
          alert("Failed to delete agent");
        }
      } catch (error) {
        console.error('Error deleting agent:', error);
        alert("Failed to delete agent");
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && newAgent.tags && !newAgent.tags.includes(tagInput.trim())) {
      setNewAgent({
        ...newAgent,
        tags: [...(newAgent.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewAgent({
      ...newAgent,
      tags: (newAgent.tags || []).filter((t) => t !== tag),
    });
  };

  const handleEditAgent = (agent: Agent, isDefault: boolean = false) => {
    setEditingAgent(agent);
    setIsEditingDefault(isDefault);
    setNewAgent(agent);
    setTagInput("");
  };

  const handleUpdateAgent = async () => {
    if (!editingAgent || !newAgent.name || !newAgent.description || !newAgent.vercelUrl) {
      alert("Please fill in all required fields (Name, Description, URL)");
      return;
    }

    try {
      const response = await fetch('/api/agents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAgent.id,
          isDefault: isEditingDefault,
          updates: {
            name: newAgent.name,
            description: newAgent.description,
            category: newAgent.category,
            tags: newAgent.tags,
            status: newAgent.status,
            vercelUrl: newAgent.vercelUrl,
            imageUrl: newAgent.imageUrl,
            primaryActionLabel: newAgent.primaryActionLabel,
          }
        }),
      });

      if (response.ok) {
        await fetchAgents();
        setEditingAgent(null);
        setIsEditingDefault(false);
        setNewAgent({
          name: "",
          description: "",
          category: "Other",
          tags: [],
          status: "Live",
          vercelUrl: "",
          imageUrl: "/agents/rate-intelligence.svg",
          primaryActionLabel: "See it in action",
        });
        setTagInput("");
        alert("Agent updated successfully!");
      } else {
        alert("Failed to update agent");
      }
    } catch (error) {
      console.error('Error updating agent:', error);
      alert("Failed to update agent");
    }
  };

  const handleCancelEdit = () => {
    setEditingAgent(null);
    setIsEditingDefault(false);
    setNewAgent({
      name: "",
      description: "",
      category: "Other",
      tags: [],
      status: "Live",
      vercelUrl: "",
      imageUrl: "/agents/rate-intelligence.svg",
      primaryActionLabel: "See it in action",
    });
    setTagInput("");
  };

  const handleResetAgent = async (agentId: string) => {
    if (confirm("Reset this agent to default values?")) {
      try {
        const response = await fetch(`/api/agents?id=${agentId}&reset=true`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchAgents();
          alert("Agent reset successfully!");
        } else {
          alert("Failed to reset agent");
        }
      } catch (error) {
        console.error('Error resetting agent:', error);
        alert("Failed to reset agent");
      }
    }
  };

  // Merge default agents with overrides
  const displayDefaultAgents = defaultAgents.map(agent => ({
    ...agent,
    ...agentOverrides[agent.id]
  }));

  const handleEditAddTag = () => {
    if (tagInput.trim() && newAgent.tags && !newAgent.tags.includes(tagInput.trim())) {
      setNewAgent({
        ...newAgent,
        tags: [...(newAgent.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleEditRemoveTag = (tag: string) => {
    setNewAgent({
      ...newAgent,
      tags: (newAgent.tags || []).filter((t) => t !== tag),
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, WebP, or SVG)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      
      // Update the image URL with the uploaded image URL
      setNewAgent({
        ...newAgent,
        imageUrl: data.url,
      });

      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-100 dark:from-[#0d1829] dark:via-[#1a2332] dark:to-[#0d1829]">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-6 hover:bg-white/50 dark:hover:bg-white/5"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Agents
        </Button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-black bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">
            Agent Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add and manage custom AI agents
          </p>
        </div>

        {/* Add New Agent Button */}
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="mb-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Agent
          </Button>
        )}

        {/* Add Agent Form */}
        {isAdding && (
          <Card className="p-6 mb-8 bg-white/80 dark:bg-[#1a2332]/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50">
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Add New Agent
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Agent Name *
                </label>
                <Input
                  placeholder="e.g., Route Optimizer"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  className="bg-white dark:bg-[#0d1829]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Describe what this agent does..."
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1829] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Agent URL *
                </label>
                <Input
                  placeholder="https://your-agent.vercel.app"
                  value={newAgent.vercelUrl}
                  onChange={(e) => setNewAgent({ ...newAgent, vercelUrl: e.target.value })}
                  className="bg-white dark:bg-[#0d1829]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={newAgent.category}
                  onChange={(e) => setNewAgent({ ...newAgent, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1829] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Planning">Planning</option>
                  <option value="Tracking">Tracking</option>
                  <option value="Intelligence">Intelligence</option>
                  <option value="Finance">Finance</option>
                  <option value="Control Tower">Control Tower</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={newAgent.status}
                  onChange={(e) => setNewAgent({ ...newAgent, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1829] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Live">Live</option>
                  <option value="Beta">Beta</option>
                  <option value="Experimental">Experimental</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="bg-white dark:bg-[#0d1829]"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                    className="shrink-0"
                  >
                    Add Tag
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newAgent.tags?.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-900"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ✕
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Image (optional)
                </label>
                
                {/* Upload Button */}
                <div className="flex gap-2 mb-3">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border-2 border-dashed ${
                      isUploading 
                        ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed' 
                        : 'border-orange-300 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-600 bg-orange-50/50 dark:bg-orange-950/20 cursor-pointer'
                    } transition-colors`}>
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Upload Image</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {/* Or use URL */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-[#1a2332] px-2 text-gray-500 dark:text-gray-400">
                      Or use URL
                    </span>
                  </div>
                </div>

                <Input
                  placeholder="/agents/your-image.svg or https://..."
                  value={newAgent.imageUrl}
                  onChange={(e) => setNewAgent({ ...newAgent, imageUrl: e.target.value })}
                  className="bg-white dark:bg-[#0d1829] mt-3"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Upload an image or enter a path/URL manually
                </p>
                {newAgent.imageUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                    <div className="relative h-32 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={newAgent.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddAgent}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Agent
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setNewAgent({
                      name: "",
                      description: "",
                      category: "Other",
                      tags: [],
                      status: "Live",
                      vercelUrl: "",
                      imageUrl: "/agents/rate-intelligence.svg",
                      primaryActionLabel: "See it in action",
                    });
                    setTagInput("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Default Agents List */}
        <div className="space-y-4 mb-12">
          <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">
            Default Agents ({displayDefaultAgents.length})
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Edit default agent URLs and details. Changes are saved locally and override the defaults.
          </p>

          <div className="grid gap-4">
            {displayDefaultAgents.map((agent) => (
              <Card
                key={agent.id}
                className="p-6 bg-white/80 dark:bg-[#1a2332]/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50"
              >
                {editingAgent?.id === agent.id && isEditingDefault ? (
                  // Edit Form (same as custom agents)
                  <div className="space-y-4">
                    <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                      Edit Agent
                    </h3>
                    
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Agent Name *
                      </label>
                      <Input
                        value={newAgent.name}
                        onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                        className="bg-white dark:bg-[#0d1829]"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={newAgent.description}
                        onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                        className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1829] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    {/* URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Agent URL *
                      </label>
                      <Input
                        value={newAgent.vercelUrl}
                        onChange={(e) => setNewAgent({ ...newAgent, vercelUrl: e.target.value })}
                        className="bg-white dark:bg-[#0d1829]"
                      />
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Card Image
                      </label>
                      
                      {/* Upload Button */}
                      <div className="flex gap-2 mb-3">
                        <label className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={isUploading}
                          />
                          <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border-2 border-dashed ${
                            isUploading 
                              ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed' 
                              : 'border-orange-300 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-600 bg-orange-50/50 dark:bg-orange-950/20 cursor-pointer'
                          } transition-colors`}>
                            {isUploading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 text-orange-500" />
                                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Upload Image</span>
                              </>
                            )}
                          </div>
                        </label>
                      </div>

                      {/* Or use URL */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white dark:bg-[#1a2332] px-2 text-gray-500 dark:text-gray-400">
                            Or use URL
                          </span>
                        </div>
                      </div>

                      <Input
                        placeholder="/agents/your-image.svg or https://..."
                        value={newAgent.imageUrl}
                        onChange={(e) => setNewAgent({ ...newAgent, imageUrl: e.target.value })}
                        className="bg-white dark:bg-[#0d1829] mt-3"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Upload an image or enter a path/URL manually
                      </p>
                      {newAgent.imageUrl && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                          <div className="relative h-32 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img
                              src={newAgent.imageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleUpdateAgent}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Update Agent
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Normal Display
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-gray-100">
                          {agent.name}
                        </h3>
                        <Badge variant="outline">{agent.category}</Badge>
                        {agentOverrides[agent.id] && (
                          <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                            Modified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {agent.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        URL: {agent.vercelUrl}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditAgent(agent, true)}
                        className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        title="Edit agent"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {agentOverrides[agent.id] && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleResetAgent(agent.id)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="Reset to default"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Custom Agents List */}
        <div className="space-y-4">
          <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">
            Custom Agents ({customAgents.length})
          </h2>

          {customAgents.length === 0 ? (
            <Card className="p-8 text-center bg-white/50 dark:bg-white/5 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50">
              <p className="text-gray-600 dark:text-gray-400">
                No custom agents yet. Click "Add New Agent" to create one.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {customAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className="p-6 bg-white/80 dark:bg-[#1a2332]/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50"
                >
                  {editingAgent?.id === agent.id ? (
                    // Edit Form
                    <div className="space-y-4">
                      <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Edit Agent
                      </h3>
                      
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Agent Name *
                        </label>
                        <Input
                          value={newAgent.name}
                          onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                          className="bg-white dark:bg-[#0d1829]"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={newAgent.description}
                          onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                          className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1829] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      {/* URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Agent URL *
                        </label>
                        <Input
                          value={newAgent.vercelUrl}
                          onChange={(e) => setNewAgent({ ...newAgent, vercelUrl: e.target.value })}
                          className="bg-white dark:bg-[#0d1829]"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          value={newAgent.category}
                          onChange={(e) => setNewAgent({ ...newAgent, category: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0d1829] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="Planning">Planning</option>
                          <option value="Tracking">Tracking</option>
                          <option value="Intelligence">Intelligence</option>
                          <option value="Finance">Finance</option>
                          <option value="Control Tower">Control Tower</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tags
                        </label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Add a tag..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleEditAddTag();
                              }
                            }}
                            className="bg-white dark:bg-[#0d1829]"
                          />
                          <Button
                            type="button"
                            onClick={handleEditAddTag}
                            variant="outline"
                            className="shrink-0"
                          >
                            Add Tag
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newAgent.tags?.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-900"
                              onClick={() => handleEditRemoveTag(tag)}
                            >
                              {tag} ✕
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Image URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Card Image
                        </label>
                        
                        {/* Upload Button */}
                        <div className="flex gap-2 mb-3">
                          <label className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={isUploading}
                            />
                            <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border-2 border-dashed ${
                              isUploading 
                                ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed' 
                                : 'border-orange-300 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-600 bg-orange-50/50 dark:bg-orange-950/20 cursor-pointer'
                            } transition-colors`}>
                              {isUploading ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 text-orange-500" />
                                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Upload Image</span>
                                </>
                              )}
                            </div>
                          </label>
                        </div>

                        {/* Or use URL */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-[#1a2332] px-2 text-gray-500 dark:text-gray-400">
                              Or use URL
                            </span>
                          </div>
                        </div>

                        <Input
                          placeholder="/agents/your-image.svg or https://..."
                          value={newAgent.imageUrl}
                          onChange={(e) => setNewAgent({ ...newAgent, imageUrl: e.target.value })}
                          className="bg-white dark:bg-[#0d1829] mt-3"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Upload an image or enter a path/URL manually
                        </p>
                        {newAgent.imageUrl && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                            <div className="relative h-32 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                              <img
                                src={newAgent.imageUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleUpdateAgent}
                          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Update Agent
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Normal Display
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-gray-100">
                            {agent.name}
                          </h3>
                          <Badge variant="outline">{agent.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {agent.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {agent.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-orange-50 to-orange-100/80 dark:from-orange-950/30 dark:to-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200/50 dark:border-orange-800/50"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          URL: {agent.vercelUrl}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditAgent(agent)}
                          className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


