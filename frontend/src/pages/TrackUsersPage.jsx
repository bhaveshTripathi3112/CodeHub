import React, { useEffect, useState } from "react";
import { axiosClient } from "../utils/axiosClient";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export default function TrackUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosClient.get("/user/getAllUsers");
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-300">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200 px-6 py-10">
      <motion.div
        className="max-w-6xl mx-auto bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-3">
          Track Users Performance
        </h1>

        {users.length === 0 ? (
          <p className="text-gray-500 text-center">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-center">Problems Solved</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-white/5 transition duration-150 border-b border-gray-800"
                  >
                    <td className="py-3 px-4 font-medium capitalize">
                      {user.firstName} {user.lastName || ""}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {user.emailId}
                    </td>
                    <td
                      className={`py-3 px-4 font-semibold ${
                        user.role === "admin"
                          ? "text-pink-400"
                          : "text-blue-400"
                      }`}
                    >
                      {user.role}
                    </td>
                    <td className="py-3 px-4 text-center text-indigo-400 font-semibold">
                      {user.problemSolved?.length || 0}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm transition-all shadow-md"
                      >
                        View Profile
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
