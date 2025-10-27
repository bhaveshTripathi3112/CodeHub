import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { logoutUser } from "../authSlice";
import { axiosClient } from "../utils/axiosClient";

function ProblemsPage() {
  let navigate = useNavigate()
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficultyLevel: "all",
    tag: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (error) {
        console.log("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(data);
      } catch (error) {
        console.log("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficultyLevel === "all" ||
      problem.difficultyLevel === filters.difficultyLevel;

    const tagMatch =
      filters.tag === "all" ||
      (Array.isArray(problem.tags)
        ? problem.tags.includes(filters.tag)
        : typeof problem.tags === "string"
        ? problem.tags.split(",").includes(filters.tag)
        : false);

    const isSolved = solvedProblems.some((sp) => sp._id === problem._id);
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved" && isSolved) ||
      (filters.status === "unsolved" && !isSolved);

    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-black text-gray-300">
      {/* Navbar */}
      <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
            CodeHub
          </NavLink>
          <div className="flex items-center gap-4">
            <div className="dropdown dropdown-end relative">
              <div>
                {user.role === 'admin' && (
                  <button onClick={() => navigate('/admin')}>Admin Panel</button>
                )}
              </div>
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {user?.firstName?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user?.firstName}</span>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl mt-2 w-48 p-2 absolute right-0"
              >
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:bg-zinc-800 rounded-md w-full text-left px-3 py-2 text-sm"
                  >
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Problems</h1>
          <p className="text-gray-400">
            Solve problems and track your progress
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium hover:border-zinc-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>

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

        {/* Problems Table */}
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
                    const difficultyColor = getDifficultyColor(problem.difficultyLevel);

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
      </div>
    </div>
  );
}

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

export default ProblemsPage;