import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios from "axios";
import { useNavigate } from "react-router";
import { axiosClient } from "../utils/axiosClient";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../components/Toaster";

// Toaster Component
// const Toast = ({ message, type, onClose }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -50, scale: 0.9 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       exit={{ opacity: 0, y: -20, scale: 0.9 }}
//       className={`fixed top-4 right-4 z-[100] px-6 py-4 rounded-lg shadow-2xl border backdrop-blur-sm ${
//         type === "success"
//   //        ? "bg-green-900/90 border-green-700 text-green-100"
//           : "bg-red-900/90 border-red-700 text-red-100"
//       }`}
//     >
//       <div className="flex items-center gap-3">
//         <p className="font-medium">{message}</p>
//         <button
//           onClick={onClose}
//           className="ml-4 text-gray-300 hover:text-white transition-colors"
//         >
//           .
//         </button>
//       </div>
//     </motion.div>
//   );
// };

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficultyLevel: z.enum(["easy", "medium", "hard"]),
  tags: z.enum([
    "array",
    "linkedList",
    "graph",
    "tree",
    "stack",
    "queue",
    "dp",
    "strings",
    "search",
  ]),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required"),
      })
    )
    .min(1, "At least one visible test case is required"),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one hidden test case is required"),
  startCode: z
    .array(
      z.object({
        language: z.enum(["c++", "java", "javascript"]),
        initialCode: z.string().min(1, "Initial Code is required"),
      })
    )
    .length(3, "Initial Code is required in all 3 languages"),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["c++", "java", "javascript"]),
        completeCode: z.string().min(1, "Complete Code is required"),
      })
    )
    .length(3, "Reference Code is required in all 3 languages"),
});

function Adminpanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      visibleTestCases: [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: [{ input: "", output: "" }],
      startCode: [
        { language: "c++", initialCode: "" },
        { language: "java", initialCode: "" },
        { language: "javascript", initialCode: "" },
      ],
      referenceSolution: [
        { language: "c++", initialCode: "" },
        { language: "java", initialCode: "" },
        { language: "javascript", initialCode: "" },
      ],
    },
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting:", data);
      await axiosClient.post("/problem/create", data);
      showToast("Problem created successfully!", "success");
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      console.error(err);
      showToast("Error creating problem. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info"},
    { id: "testcases", label: "Test Cases"},
    { id: "code", label: "Code Templates" },
    { id: "solution", label: "Solutions"},
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Create New Problem
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Fill in the details to add a new coding challenge
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700"
          >
            ← Back
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 bg-gray-900/50 p-2 rounded-xl border border-gray-700"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <motion.div
                key="basic"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-gray-900/70 rounded-xl p-6 border border-gray-700 shadow-xl">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    Problem Details
                  </h2>

                  {/* Title */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Problem Title
                    </label>
                    <input
                      type="text"
                      {...register("title")}
                      placeholder="e.g., Two Sum"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {errors.title && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      rows={6}
                      placeholder="Describe the problem in detail..."
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                    {errors.description && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <span></span> {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Difficulty and Tags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Difficulty Level
                      </label>
                      <select
                        {...register("difficultyLevel")}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                      >
                        <option value="easy"> Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                      {errors.difficultyLevel && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.difficultyLevel.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tags
                      </label>
                      <select
                        {...register("tags")}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                      >
                        <option value="array">Array</option>
                        <option value="linkedList">Linked List</option>
                        <option value="graph">Graph</option>
                        <option value="tree">Tree</option>
                        <option value="stack">Stack</option>
                        <option value="queue">Queue</option>
                        <option value="dp">Dynamic Programming</option>
                        <option value="strings">Strings</option>
                        <option value="search">Search</option>
                      </select>
                      {errors.tags && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.tags.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Test Cases Tab */}
            {activeTab === "testcases" && (
              <motion.div
                key="testcases"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                {/* Visible Test Cases */}
                <div className="bg-gray-900/70 rounded-xl p-6 border border-gray-700 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      Visible Test Cases
                    </h2>
                    <button
                      type="button"
                      onClick={() =>
                        appendVisible({ input: "", output: "", explanation: "" })
                      }
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all shadow-lg flex items-center gap-2"
                    >
                      <span>+</span> Add Test Case
                    </button>
                  </div>

                  <div className="space-y-4">
                    {visibleFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-gray-300">
                            Test Case {index + 1}
                          </h3>
                          {visibleFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVisible(index)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <input
                            placeholder="Input (e.g., [2,7,11,15], 9)"
                            {...register(`visibleTestCases.${index}.input`)}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                          <input
                            placeholder="Output (e.g., [0,1])"
                            {...register(`visibleTestCases.${index}.output`)}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                          <input
                            placeholder="Explanation"
                            {...register(`visibleTestCases.${index}.explanation`)}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Hidden Test Cases */}
                <div className="bg-gray-900/70 rounded-xl p-6 border border-gray-700 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      
                      Hidden Test Cases
                    </h2>
                    <button
                      type="button"
                      onClick={() => appendHidden({ input: "", output: "" })}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-lg flex items-center gap-2"
                    >
                      <span>+</span> Add Test Case
                    </button>
                  </div>

                  <div className="space-y-4">
                    {hiddenFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-gray-300">
                            Hidden Test Case {index + 1}
                          </h3>
                          {hiddenFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeHidden(index)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <input
                            placeholder="Input"
                            {...register(`hiddenTestCases.${index}.input`)}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                          <input
                            placeholder="Output"
                            {...register(`hiddenTestCases.${index}.output`)}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Code Templates Tab */}
            {activeTab === "code" && (
              <motion.div
                key="code"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="bg-gray-900/70 rounded-xl p-6 border border-gray-700 shadow-xl"
              >
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              
                  Starter Code Templates
                </h2>

                <div className="space-y-6">
                  {["c++", "java", "javascript"].map((lang, index) => (
                    <div key={lang} className="bg-gray-800/50 p-5 rounded-lg border border-gray-700">
                      <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                        <span className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">
                          {lang === "c++" ? "C++" : lang === "java" ? "Java" : "JavaScript"}
                        </span>
                      </label>
                      <textarea
                        {...register(`startCode.${index}.initialCode`)}
                        rows={8}
                        placeholder={`// ${lang} starter code template\n// Students will see this code`}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y font-mono text-sm min-h-[200px]"
                      />
                      {errors.startCode?.[index]?.initialCode && (
                        <p className="text-red-400 text-sm mt-2">
                          {errors.startCode[index].initialCode.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Solutions Tab */}
            {activeTab === "solution" && (
              <motion.div
                key="solution"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="bg-gray-900/70 rounded-xl p-6 border border-gray-700 shadow-xl"
              >
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Reference Solutions
                </h2>

                <div className="space-y-6">
                  {["c++", "java", "javascript"].map((lang, index) => (
                    <div key={lang} className="bg-gray-800/50 p-5 rounded-lg border border-gray-700">
                      <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs font-mono">
                          {lang === "c++" ? "C++" : lang === "java" ? "Java" : "JavaScript"}
                        </span>
                      </label>
                      <textarea
                        {...register(`referenceSolution.${index}.completeCode`)}
                        rows={10}
                        placeholder={`// ${lang} complete solution\n// This is the reference implementation`}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-y font-mono text-sm min-h-[250px]"
                      />
                      {errors.referenceSolution?.[index]?.completeCode && (
                        <p className="text-red-400 text-sm mt-2">
                          {errors.referenceSolution[index].completeCode.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation and Submit */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mt-8 bg-gray-900/70 p-4 rounded-xl border border-gray-700"
          >
            <div className="flex gap-3">
              {activeTab !== "basic" && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
                    setActiveTab(tabs[currentIndex - 1].id);
                  }}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700"
                >
                  ← Previous
                </button>
              )}
              {activeTab !== "solution" && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
                    setActiveTab(tabs[currentIndex + 1].id);
                  }}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700"
                >
                  Next →
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-lg transition-all shadow-lg font-semibold flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-lg"></span>
                  Creating...
                </>
              ) : (
                <>
                  
                  Create Problem
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}

export default Adminpanel;