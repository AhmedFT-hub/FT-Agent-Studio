"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/header";
import { AgentCard } from "@/components/agent-card";
import { AgentModal } from "@/components/agent-modal";
import { agents } from "@/lib/data";
import type { Agent } from "@/lib/types";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customAgents, setCustomAgents] = useState<Agent[]>([]);

  useEffect(() => {
    // Load custom agents from localStorage
    const stored = localStorage.getItem("customAgents");
    if (stored) {
      setCustomAgents(JSON.parse(stored));
    }
  }, []);

  const allAgents = useMemo(() => {
    return [...agents, ...customAgents];
  }, [customAgents]);

  const filteredAgents = useMemo(() => {
    if (searchQuery === "") return allAgents;
    
    return allAgents.filter((agent) => {
      const query = searchQuery.toLowerCase();
      return (
        agent.name.toLowerCase().includes(query) ||
        agent.description.toLowerCase().includes(query) ||
        agent.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        agent.category.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, allAgents]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-100 dark:from-[#0d1829] dark:via-[#1a2332] dark:to-[#0d1829] relative overflow-hidden">
      {/* Artistic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/10 via-cyan-400/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-purple-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10 group-hover:text-orange-500 transition-colors" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <Input
              placeholder="Search agents by name, description, category, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-14 h-16 text-base bg-white/80 dark:bg-[#1a2332]/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 focus-visible:ring-2 focus-visible:ring-orange-500/50 rounded-2xl shadow-lg relative z-10 transition-all"
            />
          </div>
          
          {searchQuery && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Found {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} matching "<span className="text-orange-600 dark:text-orange-400 font-medium">{searchQuery}</span>"
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onClick={() => setSelectedAgent(agent)}
            />
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block p-12 rounded-3xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50">
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                No agents found matching "{searchQuery}"
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                Try a different search term
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
      </main>

      <AgentModal
        agent={selectedAgent}
        isOpen={!!selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />
    </div>
  );
}
