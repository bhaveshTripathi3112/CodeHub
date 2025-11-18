import React from "react";
import { motion } from "framer-motion";
import { SiMongodb, SiExpress, SiReact, SiNodedotjs, SiDocker, SiAwsamplify } from "react-icons/si";
import { FaCode, FaBrain, FaRocket } from "react-icons/fa";

function AboutPage() {
  const techIcons = [
    { icon: <SiMongodb size={40} />, label: "MongoDB" },
    { icon: <SiExpress size={40} />, label: "Express.js" },
    { icon: <SiReact size={40} />, label: "React.js" },
    { icon: <SiNodedotjs size={40} />, label: "Node.js" },
    { icon: <SiDocker size={40} />, label: "Docker" },
    // { icon: <SiAwsamplify size={40} />, label: "AWS" },
  ];

  const features = [
    {
      icon: <FaCode className="text-blue-400" size={26} />,
      title: "Multi-Language Code Execution",
      desc: "Supports over 3 programming languages with real-time output powered by Judge0 API integration.",
    },
    {
      icon: <FaBrain className="text-purple-400" size={26} />,
      title: "Smart Submission Tracking",
      desc: "Uses compound indexing in MongoDB for instant access to per-user and per-problem submission history.",
    },
    {
      icon: <FaRocket className="text-green-400" size={26} />,
      title: "Optimized Performance",
      desc: "API architecture designed for 35% faster responses and scalable backend throughput.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200 px-6 py-12">
      <motion.div
        className="max-w-5xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          About CodeHub
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          CodeHub is a full-stack online coding platform that empowers users to
          write, compile, and execute code in real-time — directly in their
          browser. Designed with performance and scalability in mind, CodeHub
          ensures a smooth and powerful problem-solving experience for
          developers worldwide.
        </p>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="bg-white/5 backdrop-blur-md rounded-xl p-6 text-left border border-gray-700 hover:border-blue-400 transition-all"
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center gap-3 mb-3">
                {f.icon}
                <h3 className="text-xl font-semibold">{f.title}</h3>
              </div>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-blue-400">
            Powered by Modern Technologies
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {techIcons.map((t, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition"
                whileHover={{ scale: 1.1 }}
              >
                {t.icon}
                <span className="text-sm">{t.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-gray-500 text-sm">
          <p>
            Designed & Developed by{" "}
            <span className="text-blue-400 font-semibold">Bhavesh Tripathi</span>{" "}
            | Built with ❤️ using MERN Stack
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default AboutPage;
