import React from "react";
import { useNavigate } from "react-router";

function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 bg-zinc-900 text-center border-t border-zinc-800">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
        Ready to test your skills?
      </h2>
      <p className="text-gray-400 mb-10 max-w-xl mx-auto">
        Start solving problems, improve your coding logic, and become a better developer with CodeHub.
      </p>
      <button
        onClick={() => navigate("/problems")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-[0_0_20px_#3b82f6]/30"
      >
        Explore Problems
      </button>
    </section>
  );
}

export default CTASection;
