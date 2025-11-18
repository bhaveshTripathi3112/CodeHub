import React, { useEffect, useState } from "react";
import { axiosClient } from "../utils/axiosClient";
import Toast from "../components/Toaster";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

export default function DeleteProblemsPage() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch all problems
  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/problem/getAllProblem");

      // console.log("API Response:", res.data);

      // Backend returns array directly
      setProblems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch problems", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete function
  const deleteProblem = async (id) => {
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      showToast("Problem deleted successfully!", "success");
      fetchProblems();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete problem", "error");
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white px-6 py-10">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Delete Problems</h1>

        <button
          onClick={() => navigate("/admin")}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-gray-300 transition"
        >
          ← Back
        </button>
      </div>

      {/* Problems List */}
      <div className="max-w-4xl mx-auto space-y-6">
        {loading ? (
          <p className="text-center text-gray-400">Loading problems...</p>
        ) : problems.length === 0 ? (
          <p className="text-center text-gray-500">No problems found.</p>
        ) : (
          problems.map((problem) => (
            <motion.div
              key={problem._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/70 border border-gray-700 p-5 rounded-xl"
            >
              <h2 className="text-xl font-bold">{problem.title}</h2>

              <div className="flex justify-between items-center mt-2">
                <div className="space-y-1">
                  <p className="text-gray-300">
                    <strong>Difficulty:</strong> {problem.difficultyLevel}
                  </p>
                  <p className="text-gray-400">
                    <strong>Tag:</strong> {problem.tags}
                  </p>
                </div>

                <button
                  onClick={() => deleteProblem(problem._id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
