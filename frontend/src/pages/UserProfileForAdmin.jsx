import React, { useEffect, useState } from "react";
import { axiosClient } from "../utils/axiosClient";
import { motion } from "framer-motion";
import { useParams } from "react-router";

const difficultyColor = {
  easy: "text-green-400 bg-green-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  hard: "text-red-400 bg-red-400/10",
};

export default function UserProfileForAdmin() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // ✅ user ID from admin route

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosClient.get(`/user/getProfile/${id}`);
        setProfile(res.data.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-300">
        Loading...
      </div>
    );

  if (!profile)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        Failed to load profile.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200 px-6 py-10">
      <motion.div
        className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-3xl font-bold text-white">
            {profile.firstName[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-gray-400">{profile.emailId}</p>
            <p className="text-sm mt-1 px-2 py-1 bg-gray-700 inline-block rounded-lg">
              Role: {profile.role}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10">
          <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-5 flex justify-between items-center">
            <div>
              <h2 className="text-lg text-gray-400">Total Problems Solved</h2>
              <p className="text-3xl font-bold text-indigo-400">
                {profile.totalSolved}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Last Updated: {new Date(profile.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Solved Problems */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
            Solved Problems
          </h2>
          {profile.problemsSolved.length === 0 ? (
            <p className="text-gray-500">No problems solved yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="py-3 px-2">Title</th>
                    <th className="py-3 px-2">Difficulty</th>
                    <th className="py-3 px-2">Tag</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.problemsSolved.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition duration-150">
                      <td className="py-3 px-2 font-medium">{p.title}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded-lg text-sm font-semibold ${difficultyColor[p.difficulty]}`}
                        >
                          {p.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-400">{p.tags}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
