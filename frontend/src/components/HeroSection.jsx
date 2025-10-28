import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux"; // assuming you store user in Redux

function HeroSection() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // adjust based on your auth slice

  const handleStartSolving = () => {
    if (user) {
      navigate("/problems");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-[80vh] px-6 bg-gradient-to-b from-zinc-900 via-black to-zinc-950 overflow-hidden">
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold text-white mb-6"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to <span className="text-blue-500">CodeHub</span>
      </motion.h1>

      <motion.p
        className="max-w-2xl text-gray-400 text-lg mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Sharpen your coding skills, solve challenges, and compete with developers worldwide.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={handleStartSolving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-[0_0_20px_#3b82f6]/30 hover:shadow-[0_0_25px_#3b82f6]/50"
        >
          Start Solving
        </button>
      </motion.div>

      {/* Decorative glowing background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_60%)] pointer-events-none"></div>
    </section>
  );
}

export default HeroSection;
