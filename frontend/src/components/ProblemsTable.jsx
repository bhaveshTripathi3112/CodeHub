// src/components/ProblemsTable.jsx
import React from "react";
import { NavLink } from "react-router";

function ProblemsTable({ filteredProblems, solvedProblems }) {
  const getDifficultyColor = (difficultyLevel) => {
    switch (difficultyLevel?.toLowerCase()) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "hard":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
      {filteredProblems.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No problems found with current filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-800">
              <tr className="text-left text-sm font-medium text-gray-400">
                <th className="px-6 py-4 w-12">Status</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4 w-32">Difficulty</th>
                <th className="px-6 py-4">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem, index) => {
                const isSolved = solvedProblems.some(
                  (sp) => sp._id === problem._id
                );
                const difficultyColor = getDifficultyColor(
                  problem.difficultyLevel
                );

                return (
                  <tr
                    key={problem._id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {isSolved ? (
                        <span className="text-green-500 text-lg">✓</span>
                      ) : (
                        <span className="text-gray-600">○</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <NavLink
                        to={`/problem/${problem._id}`}
                        className="text-white hover:text-blue-500 font-medium transition-colors"
                      >
                        {index + 1}. {problem.title}
                      </NavLink>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${difficultyColor}`}
                      >
                        {problem.difficultyLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {(Array.isArray(problem.tags)
                          ? problem.tags
                          : typeof problem.tags === "string"
                          ? problem.tags.split(",").map((tag) => tag.trim())
                          : []
                        ).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-zinc-800 rounded text-xs text-gray-400 border border-zinc-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProblemsTable;
