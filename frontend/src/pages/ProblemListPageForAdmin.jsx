import React, { useEffect, useState } from "react";
import { axiosClient } from "../utils/axiosClient";
import { useNavigate } from "react-router";

function ProblemListPage() {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  async function fetchProblems() {
    try {
      const res = await axiosClient.get("/problem/getAllProblem");
      setProblems(res.data);
    } catch (err) {
      console.error("Error fetching problems:", err);
    }
  }

  useEffect(() => {
    fetchProblems();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0c10] p-10">
      <h1 className="text-3xl text-white font-bold mb-6">All Problems</h1>

      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
        <table className="w-full text-left text-white">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-3">Title</th>
              <th className="p-3">Difficulty</th>
              <th className="p-3">Tag</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {problems.map((p) => (
              <tr key={p._id} className="border-b border-gray-800">
                <td className="p-3">{p.title}</td>
                <td className="p-3 capitalize">{p.difficultyLevel}</td>
                <td className="p-3">{p.tags}</td>
                <td className="p-3">
                  <button
                    onClick={() => navigate(`/admin/problemPage/updateProblem/${p._id}`)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default ProblemListPage;
