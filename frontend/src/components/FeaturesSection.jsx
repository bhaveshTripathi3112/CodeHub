import React from "react";
import { motion } from "framer-motion";
import { Code, BarChart, Award, Shield } from "lucide-react";

const features = [
  {
    icon: <Code size={28} />,
    title: "Interactive Code Editor",
    desc: "Write and run code in real time directly in your browser.",
  },
  {
    icon: <Award size={28} />,
    title: "Gamified Learning",
    desc: "Earn points, badges, and climb the global leaderboard.",
  },
  {
    icon: <BarChart size={28} />,
    title: "Detailed Insights",
    desc: "Track your performance, accuracy, and coding streaks.",
  },
  {
    icon: <Shield size={28} />,
    title: "Secure Environment",
    desc: "Run your code safely in isolated sandboxes.",
  },
];

function FeaturesSection() {
  return (
    <section className="py-20 px-6 bg-zinc-950 border-t border-zinc-800">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
        Why Choose <span className="text-blue-500">CodeHub</span>?
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-md hover:border-blue-500 transition-all"
          >
            <div className="text-blue-400 mb-3">{f.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;
