// src/components/Filters.jsx
import React from "react";

function Filters({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {/* Status Filter */}
      <select
        className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium hover:border-zinc-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="all">All</option>
        <option value="solved">Solved</option>
        <option value="unsolved">Unsolved</option>
      </select>

      {/* Difficulty Filter */}
      <select
        className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium hover:border-zinc-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
        value={filters.difficultyLevel}
        onChange={(e) =>
          setFilters({ ...filters, difficultyLevel: e.target.value })
        }
      >
        <option value="all">Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      {/* Tags Filter */}
      <select
        className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium hover:border-zinc-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
        value={filters.tag}
        onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
      >
        <option value="all">Tags</option>
        <option value="array">Array</option>
        <option value="strings">String</option>
        <option value="linkedList">Linked List</option>
        <option value="graph">Graph</option>
        <option value="dp">DP</option>
      </select>
    </div>
  );
}

export default Filters;
