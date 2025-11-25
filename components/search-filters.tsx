"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categories, statuses } from "@/lib/data";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
  onClearFilters: () => void;
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  selectedStatuses,
  onStatusChange,
  onClearFilters,
}: SearchFiltersProps) {
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategories.length > 0 ||
    selectedStatuses.length > 0;

  return (
    <div className="space-y-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10 group-hover:text-orange-500 transition-colors" />
        <Input
          placeholder="Search agents by name, description, or tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-14 text-base bg-white/80 dark:bg-[#1a2332]/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 focus-visible:ring-2 focus-visible:ring-orange-500/50 rounded-xl shadow-lg relative z-10 transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"></span>
          Category
        </span>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategories.includes(category) ? "default" : "outline"}
            className={`cursor-pointer transition-all hover:scale-105 hover:shadow-md ${
              selectedCategories.includes(category)
                ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30"
                : "hover:bg-orange-50 dark:hover:bg-orange-950/30"
            }`}
            onClick={() => toggleCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"></span>
          Status
        </span>
        {statuses.map((status) => {
          const isSelected = selectedStatuses.includes(status);
          const colorClasses = {
            Live: isSelected
              ? "bg-emerald-600 text-white border-emerald-600"
              : "border-emerald-600 text-emerald-700 dark:text-emerald-400",
            Beta: isSelected
              ? "bg-orange-600 text-white border-orange-600"
              : "border-orange-600 text-orange-700 dark:text-orange-400",
            Experimental: isSelected
              ? "bg-cyan-600 text-white border-cyan-600"
              : "border-cyan-600 text-cyan-700 dark:text-cyan-400",
          };

          return (
            <Badge
              key={status}
              variant="outline"
              className={`cursor-pointer transition-all hover:scale-105 hover:shadow-md ${colorClasses[status]}`}
              onClick={() => toggleStatus(status)}
            >
              {status}
            </Badge>
          );
        })}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto h-8 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}
