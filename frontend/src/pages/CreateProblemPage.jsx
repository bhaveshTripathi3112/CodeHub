// CreateProblemPage.jsx
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useNavigate } from "react-router";
import { axiosClient } from "../utils/axiosClient";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../components/Toaster";

// DOCX parser
import mammoth from "mammoth";

// PDF parser
import * as pdfjsLib from "pdfjs-dist/webpack";

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
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().min(1, "Explanation is required"),
    })
  ),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
    })
  ),
  startCode: z.array(
    z.object({
      language: z.enum(["c++", "java", "javascript"]),
      initialCode: z.string().min(1, "Initial Code is required"),
    })
  ),
  referenceSolution: z.array(
    z.object({
      language: z.enum(["c++", "java", "javascript"]),
      completeCode: z.string().min(1, "Complete Code is required"),
    })
  ),
});

function CreateProblemPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      visibleTestCases: [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: [],
      startCode: [
        { language: "c++", initialCode: "" },
        { language: "java", initialCode: "" },
        { language: "javascript", initialCode: "" },
      ],
      referenceSolution: [
        { language: "c++", completeCode: "" },
        { language: "java", completeCode: "" },
        { language: "javascript", completeCode: "" },
      ],
    },
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } =
    useFieldArray({ control, name: "visibleTestCases" });

  const {
    fields: hiddenFields,
    replace: replaceHidden,
  } = useFieldArray({ control, name: "hiddenTestCases" });

  // --------------------------------------------------------------
  // UNIVERSAL HIDDEN TESTCASE PARSER
  // --------------------------------------------------------------
  const extractHiddenTestcases = (rawText) => {
    if (!rawText || !rawText.trim()) {
      showToast("No readable text found. DOCX/PDF may contain only images.", "error");
      return;
    }

    let text = rawText
      .replace(/\r/g, "")
      .replace(/INPUT\s*:/gi, "\nINPUT:\n")
      .replace(/OUTPUT\s*:/gi, "\nOUTPUT:\n")
      .replace(/[ ]{2,}/g, " ")
      .replace(/\n{2,}/g, "\n")
      .trim();

    const blocks = text
      .split(/INPUT:/gi)
      .map((b) => b.trim())
      .filter(Boolean);

    const extracted = [];

    for (const block of blocks) {
      const [input, rest] = block.split(/OUTPUT:/gi);
      if (!input || !rest) continue;
      extracted.push({
        input: input.trim(),
        output: rest.trim(),
      });
    }

    if (!extracted.length) {
      showToast("Could not detect INPUT:/OUTPUT:. Check file format.", "error");
      return;
    }

    replaceHidden(extracted);
    showToast(`${extracted.length} hidden test case(s) loaded`, "success");
  };

  // --------------------------------------------------------------
  // DOCX UPLOAD HANDLER
  // --------------------------------------------------------------
  const handleDocxUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Accept .docx mime
    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      showToast("Upload a valid DOCX file (.docx).", "error");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;
      extractHiddenTestcases(text);
    } catch (err) {
      console.error("DOCX read error:", err);
      showToast("Error reading DOCX file.", "error");
    }
  };

  // --------------------------------------------------------------
  // PDF UPLOAD HANDLER
  // --------------------------------------------------------------
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      showToast("Upload a valid PDF file.", "error");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map((x) => x.str).join(" ") + "\n";
      }

      extractHiddenTestcases(fullText);
    } catch (err) {
      console.error("PDF extraction failed:", err);
      showToast("PDF extraction failed.", "error");
    }
  };

  // --------------------------------------------------------------
  // SUBMIT HANDLER
  // --------------------------------------------------------------
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const normalize = (txt) =>
        (txt || "")
          .replace(/\r/g, "")
          .replace(/\\n/g, "\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim();

      const payload = {
        ...data,
        description: normalize(data.description),
        visibleTestCases: (data.visibleTestCases || []).map((tc) => ({
          ...tc,
          input: normalize(tc.input),
          output: normalize(tc.output),
          explanation: normalize(tc.explanation),
        })),
        hiddenTestCases: (data.hiddenTestCases || []).map((tc) => ({
          ...tc,
          input: normalize(tc.input),
          output: normalize(tc.output),
        })),
        startCode: (data.startCode || []).map((s) => ({
          ...s,
          initialCode: normalize(s.initialCode),
        })),
        referenceSolution: (data.referenceSolution || []).map((s) => ({
          ...s,
          completeCode: normalize(s.completeCode),
        })),
      };

      await axiosClient.post("/problem/create", payload);

      showToast("Problem created successfully!", "success");
      setTimeout(() => navigate("/admin"), 1100);
    } catch (error) {
    console.error("Submit error:", error);

    const backendMessage =
      error.response?.data?.message ||  // message from backend
      error.message ||                  // axios/system message
      "Something went wrong.";          // fallback

    showToast(backendMessage, "error");
  } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "testcases", label: "Test Cases" },
    { id: "code", label: "Code Templates" },
    { id: "solution", label: "Solutions" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700"
          >
            ← Back
          </button>

          <div className="flex flex-col items-center text-center flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r bg-blue-400 bg-clip-text text-transparent">
              Create New Problem
            </h1>
            <p className="text-gray-400 text-sm mt-1">Fill in the details to add a new coding challenge</p>
          </div>

          <div className="w-[100px]" />
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
                activeTab === tab.id ? "bg-gradient-to-r bg-blue-400 text-white shadow-lg" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              }`}
            >
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
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">Problem Details</h2>

                  {/* Title */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Problem Title</label>
                    <input
                      type="text"
                      {...register("title")}
                      placeholder="e.g., Two Sum"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      {...register("description")}
                      rows={6}
                      placeholder="Describe the problem in detail..."
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                    {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
                  </div>

                  {/* Difficulty and Tags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level</label>
                      <select
                        {...register("difficultyLevel")}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                      >
                        <option value="easy"> Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                      {errors.difficultyLevel && <p className="text-red-400 text-sm mt-1">{errors.difficultyLevel.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
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
                      {errors.tags && <p className="text-red-400 text-sm mt-1">{errors.tags.message}</p>}
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
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">Visible Test Cases</h2>
                    <button
                      type="button"
                      onClick={() => appendVisible({ input: "", output: "", explanation: "" })}
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
                          <h3 className="text-sm font-medium text-gray-300">Test Case {index + 1}</h3>
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
                          <textarea
                            placeholder="Input (write in multiple lines)"
                            {...register(`visibleTestCases.${index}.input`)}
                            rows={4}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white
                            placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
                          />

                          <textarea
                            placeholder="Output"
                            {...register(`visibleTestCases.${index}.output`)}
                            rows={2}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white
                            placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
                          />

                          <textarea
                            placeholder="Explanation"
                            {...register(`visibleTestCases.${index}.explanation`)}
                            rows={2}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white
                            placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>


                {/* Hidden Test Cases (DOCX/PDF only + preview) */}
                <div className="bg-gray-900/70 rounded-xl p-6 border border-gray-700 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">Hidden Test Cases (Upload DOCX or PDF)</h2>
                  </div>

                  {/* Upload Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-300 block mb-2">Upload DOCX</label>
                      <input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleDocxUpload} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 cursor-pointer" />
                      <p className="text-sm text-gray-400 mt-2">Preferred: upload a DOCX exported from Google Docs or Word. Parser will extract INPUT:/OUTPUT: blocks.</p>
                    </div>
                    {/* <div>
                      <label className="text-gray-300 block mb-2">Upload PDF</label>
                      <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 cursor-pointer" />
                      <p className="text-sm text-gray-400 mt-2">If using PDF, export from Google Docs or 'Save As → PDF' from Word (avoid Print-to-PDF).</p>
                    </div> */}
                  </div>

                  {/* Read-only Preview */}
                  <div className="mt-6">
                    <h3 className="text-sm text-gray-300 mb-3">Extracted Hidden Test Cases Preview</h3>

                    {hiddenFields.length === 0 ? (
                      <div className="text-sm text-gray-400">No hidden test cases loaded yet. Upload a DOCX or PDF to populate them.</div>
                    ) : (
                      <div className="space-y-4">
                        {hiddenFields.map((hf, idx) => (
                          <div key={hf.id} className="bg-gray-800/60 p-4 rounded border border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-200">Testcase {idx + 1}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-gray-400 mb-1 block">Input</label>
                                <pre className="whitespace-pre-wrap text-sm bg-gray-900 p-3 rounded text-gray-200 min-h-[56px]">{hf.input}</pre>
                              </div>
                              <div>
                                <label className="text-xs text-gray-400 mb-1 block">Output</label>
                                <pre className="whitespace-pre-wrap text-sm bg-gray-900 p-3 rounded text-gray-200 min-h-[56px]">{hf.output}</pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Code Templates Tab */}
            {activeTab === "code" && (
              <motion.div key="code" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-gray-900/70 rounded-xl p-6 border border-gray-700 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">Starter Code Templates</h2>

                <div className="space-y-6">
                  {["c++", "java", "javascript"].map((lang, index) => (
                    <div key={lang} className="bg-gray-800/50 p-5 rounded-lg border border-gray-700">
                      <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                        <span className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">{lang === "c++" ? "C++" : lang === "java" ? "Java" : "JavaScript"}</span>
                      </label>
                      <textarea {...register(`startCode.${index}.initialCode`)} rows={8} placeholder={`// ${lang} starter code template\n// Students will see this code`} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y font-mono text-sm min-h-[200px]" />
                      {errors.startCode?.[index]?.initialCode && <p className="text-red-400 text-sm mt-2">{errors.startCode[index].initialCode.message}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Solutions Tab */}
            {activeTab === "solution" && (
              <motion.div key="solution" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-gray-900/70 rounded-xl p-6 border border-gray-700 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><span className="text-2xl">🎯</span>Reference Solutions</h2>

                <div className="space-y-6">
                  {["c++", "java", "javascript"].map((lang, index) => (
                    <div key={lang} className="bg-gray-800/50 p-5 rounded-lg border border-gray-700">
                      <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs font-mono">{lang === "c++" ? "C++" : lang === "java" ? "Java" : "JavaScript"}</span>
                      </label>
                      <textarea {...register(`referenceSolution.${index}.completeCode`)} rows={10} placeholder={`// ${lang} complete solution\n// This is the reference implementation`} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-y font-mono text-sm min-h-[250px]" />
                      {errors.referenceSolution?.[index]?.completeCode && <p className="text-red-400 text-sm mt-2">{errors.referenceSolution[index].completeCode.message}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation and Submit */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-between mt-8 bg-gray-900/70 p-4 rounded-xl border border-gray-700">
            <div className="flex gap-3">
              {activeTab !== "basic" && (
                <button type="button" onClick={() => { const currentIndex = tabs.findIndex((t) => t.id === activeTab); setActiveTab(tabs[currentIndex - 1].id); }} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700">
                  ← Previous
                </button>
              )}
              {activeTab !== "solution" && (
                <button type="button" onClick={() => { const currentIndex = tabs.findIndex((t) => t.id === activeTab); setActiveTab(tabs[currentIndex + 1].id); }} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700">
                  Next →
                </button>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-lg transition-all shadow-lg font-semibold flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-lg"></span>
                  Creating...
                </>
              ) : (
                <>Create Problem</>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}

export default CreateProblemPage;
