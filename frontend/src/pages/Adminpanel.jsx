import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

function AdminPanel() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Create Problem",
      description: "Add new coding challenges for users to solve.",
      gradient: "from-blue-500 to-purple-600",
      onClick: () => navigate("/admin/createProblem"),
      button:"create"
    },
    {
      title: "Update Problem",
      description: "Modify existing problem details like title or difficulty.",
      gradient: "from-green-500 to-emerald-600",
      onClick: () => navigate("/admin/problemPage"),
       button:"update"
    },
    {
      title: "Delete Problem",
      description: "Remove outdated or duplicate problems from the system.",
      gradient: "from-red-500 to-pink-600",
      onClick: () => navigate("/admin/deleteProblem"),
       button:"delete"
    },
    {
      title: "Register Admin",
      description: "Add a new admin user with special permissions.",
      gradient: "from-yellow-400 to-orange-500",
      onClick: () => navigate("/admin/register"),
       button:"register"
    },
    {
      title: "Show Users",
      description: "Track the performance of users.",
      gradient: "from-yellow-400 to-orange-500",
      onClick: () => navigate("/admin/trackUsers"),
       button:"Show Users"
    },
  ];

  return (
    <section className="min-h-screen bg-[#0a0c10] text-white px-8 py-16">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-blue-400 mb-2"
        >
          Admin Dashboard
        </motion.h1>
        <p className="text-gray-400 text-lg">
          Manage coding problems, users, and platform settings.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ scale: 1.05 }}
            className="bg-[#151820] p-6 rounded-2xl border border-gray-800 shadow-lg transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
            <p className="text-gray-400 mb-4">{feature.description}</p>
            <button
              onClick={feature.onClick}
              className={`px-6 py-2 bg-gradient-to-r ${feature.gradient} rounded-lg font-medium hover:opacity-90 transition`}
            >
              {feature.button}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default AdminPanel;
