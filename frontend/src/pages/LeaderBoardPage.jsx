import React, { useEffect, useState } from "react";
import { axiosClient } from "../utils/axiosClient";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  const [data, setData] = useState([]);

  const fetchLeaderboard = async () => {
    const res = await axiosClient.get("/leaderboard/all");

    setData(res.data.leaderboard);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0c10] p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
        Global Leaderboard
      </h1>

      <div className="max-w-4xl mx-auto bg-gray-900/60 rounded-xl p-6 border border-gray-700">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-300 border-b border-gray-700">
              <th className="p-3">Rank</th>
              <th className="p-3">User</th>
              <th className="p-3 text-center">Easy</th>
              <th className="p-3 text-center">Medium</th>
              <th className="p-3 text-center">Hard</th>
              <th className="p-3 text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u, i) => (
              <motion.tr
                key={u.userId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-gray-800 hover:bg-gray-800/30"
              >
                <td className="p-3 text-yellow-400 font-bold">{i + 1}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3 text-center text-green-400">{u.easyCount}</td>
                <td className="p-3 text-center text-yellow-400">{u.mediumCount}</td>
                <td className="p-3 text-center text-red-400">{u.hardCount}</td>
                <td className="p-3 text-center font-semibold text-blue-400">{u.score}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
