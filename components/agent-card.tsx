"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Agent } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface AgentCardProps {
  agent: Agent;
  onClick: () => void;
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  // Display first 3 tags, hide the rest
  const visibleTags = agent.tags.slice(0, 3);
  const remainingCount = agent.tags.length - 3;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-[#1a2332] dark:via-[#1a2332] dark:to-[#0d1829]/50 border border-gray-200/50 dark:border-gray-700/50 cursor-pointer group hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 backdrop-blur-sm relative">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-transparent to-purple-500/0 group-hover:from-orange-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none"></div>
        
        {/* Image Banner */}
        <div className="relative h-48 md:h-64 w-full overflow-hidden bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600">
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={agent.imageUrl}
              alt={agent.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to gradient background if image fails
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6 relative z-10">
          {/* Name */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {agent.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1 leading-relaxed">
            {agent.description}
          </p>

          {/* Category Badge */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="text-xs bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
              {agent.category}
            </Badge>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {visibleTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-orange-50 to-orange-100/80 dark:from-orange-950/30 dark:to-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200/50 dark:border-orange-800/50 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs bg-gray-100/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-medium backdrop-blur-sm">
                +{remainingCount} more
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <Button
              onClick={onClick}
              size="sm"
              className="group/btn bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all"
            >
              {agent.primaryActionLabel || "Open Agent"}
              <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
