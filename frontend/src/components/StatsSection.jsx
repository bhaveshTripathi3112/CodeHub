import React from "react";
import { motion } from "framer-motion";

function StatsSection() {
  const stats = [
    { label: "Active Users", value: "10" },
    { label: "Problems Solved", value: "25" },
    { label: "Coding Challenges", value: "10" },
    { label: "Global Reach", value: "0" },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-zinc-950 to-black text-center">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <h3 className="text-3xl font-bold text-blue-500">{stat.value}</h3>
            <p className="text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;
