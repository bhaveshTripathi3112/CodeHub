import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
function Toast({ message, type, onClose }) {
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`fixed top-4 right-4 z-[100] px-6 py-4 rounded-lg shadow-2xl border backdrop-blur-sm ${
        type === "success"
          ? "bg-green-900/90 border-green-700 text-green-100"
          : "bg-red-900/90 border-red-700 text-red-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-gray-300 hover:text-white transition-colors"
        >
          🗙
        </button>
      </div>
    </motion.div>
  );
};


export default Toast
