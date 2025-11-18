import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useNavigate, useParams } from "react-router";
import { axiosClient } from "../utils/axiosClient";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../components/Toaster";
import { extractPDFText } from "../utils/pdfParser";

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
    .min(1),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1),
  startCode: z
    .array(
      z.object({
        language: z.enum(["c++", "java", "javascript"]),
        initialCode: z.string(),
      })
    )
    .length(3),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["c++", "java", "javascript"]),
        completeCode: z.string(),
      })
    )
    .length(3),
});

function UpdateProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(true);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const normalizeText = (text) =>
    text.replace(/\r/g, "").replace(/\\n/g, "\n").trim();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } =
    useFieldArray({ control, name: "visibleTestCases" });

  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } =
    useFieldArray({ control, name: "hiddenTestCases" });

  // ---------------- FETCH PROBLEM BY ID ----------------
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosClient.get(`/problem/adminGetProblem/${id}`);
        const p = res.data;

        // Set values for form
        setValue("title", p.title);
        setValue("description", p.description);
        setValue("difficultyLevel", p.difficultyLevel);
        setValue("tags", p.tags);

        setValue("visibleTestCases", p.visibleTestCases);
        setValue("hiddenTestCases", p.hiddenTestCases);

        setValue(
          "startCode",
          p.startCode?.length === 3
            ? p.startCode
            : [
                { language: "c++", initialCode: "" },
                { language: "java", initialCode: "" },
                { language: "javascript", initialCode: "" },
              ]
        );

        setValue(
          "referenceSolution",
          p.referenceSolution?.length === 3
            ? p.referenceSolution
            : [
                { language: "c++", completeCode: "" },
                { language: "java", completeCode: "" },
                { language: "javascript", completeCode: "" },
              ]
        );

        setIsLoading(false);
      } catch (err) {
        console.error(err);
        showToast("Error loading problem", "error");
      }
    }

    fetchData();
  }, [id, setValue]);

  // ------------------- SUBMIT UPDATE --------------------
  const onSubmit = async (data) => {
    try {
      const cleanData = {
        ...data,
        description: normalizeText(data.description),

        visibleTestCases: data.visibleTestCases.map((tc) => ({
          ...tc,
          input: normalizeText(tc.input),
          output: normalizeText(tc.output),
          explanation: normalizeText(tc.explanation),
        })),

        hiddenTestCases: data.hiddenTestCases.map((tc) => ({
          ...tc,
          input: normalizeText(tc.input),
          output: normalizeText(tc.output),
        })),

        startCode: data.startCode.map((s) => ({
          ...s,
          initialCode: normalizeText(s.initialCode),
        })),

        referenceSolution: data.referenceSolution.map((s) => ({
          ...s,
          completeCode: normalizeText(s.completeCode),
        })),
      };

      await axiosClient.put(`/problem/update/${id}`, cleanData);
      showToast("Problem updated successfully!", "success");

      setTimeout(() => navigate("/admin/problemPage"), 1500);
    } catch (err) {
      console.log(err);
      showToast("Failed to update problem!", "error");
    }
  };

  // ------------------- PDF UPLOAD --------------------
  const parseHiddenTestcases = (text) => {
    const blocks = text.split(/TESTCASE\s+\d+/i).filter((b) => b.trim() !== "");
    return blocks.map((b) => {
      const inputMatch = b.match(/INPUT:\s*([\s\S]*?)OUTPUT:/i);
      const outputMatch = b.match(/OUTPUT:\s*([\s\S]*)/i);

      return {
        input: inputMatch ? inputMatch[1].trim() : "",
        output: outputMatch ? outputMatch[1].trim() : "",
      };
    });
  };

  const handlePDFUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const text = await extractPDFText(file);
      const parsed = parseHiddenTestcases(text);

      removeHidden();
      parsed.forEach((tc) => appendHidden(tc));

      showToast("Hidden testcases imported!", "success");
    } catch (err) {
      showToast("Failed to parse PDF!", "error");
    }
  };

  if (isLoading)
    return <div className="text-white p-10 text-xl">Loading problem...</div>;

  // ----------------------------------------------------
  // ------------------------ UI ------------------------
  // ----------------------------------------------------

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "testcases", label: "Test Cases" },
    { id: "code", label: "Code Templates" },
    { id: "solution", label: "Solutions" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10] p-6">
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-bold text-white mb-6">
        Update Problem – {id}
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-900 p-2 rounded-lg border border-gray-700 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-lg ${
              activeTab === tab.id
                ? "bg-blue-500 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* TAB 1 — BASIC INFO */}
          {activeTab === "basic" && (
            <motion.div
              key="basic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 space-y-4">
                <div>
                  <label className="text-gray-300">Title</label>
                  <input
                    {...register("title")}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                </div>

                <div>
                  <label className="text-gray-300">Description</label>
                  <textarea
                    {...register("description")}
                    rows={6}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2 — TEST CASES */}
          {activeTab === "testcases" && (
            <motion.div key="testcases" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-gray-900 p-6 rounded border border-gray-700">
                <h2 className="text-white text-xl mb-4">Visible Test Cases</h2>

                {visibleFields.map((field, index) => (
                  <div key={field.id} className="bg-gray-800 p-4 rounded mb-4">
                    <textarea
                      {...register(`visibleTestCases.${index}.input`)}
                      rows={3}
                      className="w-full bg-gray-700 text-white p-2 rounded mb-2"
                    />
                    <textarea
                      {...register(`visibleTestCases.${index}.output`)}
                      rows={2}
                      className="w-full bg-gray-700 text-white p-2 rounded mb-2"
                    />
                    <input
                      {...register(`visibleTestCases.${index}.explanation`)}
                      className="w-full bg-gray-700 text-white p-2 rounded"
                    />
                  </div>
                ))}

                <h2 className="text-white text-xl mb-4 mt-8">Hidden Test Cases</h2>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePDFUpload}
                  className="w-full bg-gray-800 text-gray-300 p-2 rounded"
                />

                {hiddenFields.map((field, index) => (
                  <div key={field.id} className="bg-gray-800 p-4 rounded my-4">
                    <textarea
                      {...register(`hiddenTestCases.${index}.input`)}
                      rows={3}
                      className="w-full bg-gray-700 text-white p-2 rounded mb-2"
                    />
                    <textarea
                      {...register(`hiddenTestCases.${index}.output`)}
                      rows={2}
                      className="w-full bg-gray-700 text-white p-2 rounded"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3 — STARTER CODE */}
          {activeTab === "code" && (
            <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-gray-900 p-6 rounded border border-gray-700 space-y-6">
                {["c++", "java", "javascript"].map((lang, index) => (
                  <div key={lang}>
                    <label className="text-gray-300 mb-2 block">{lang}</label>
                    <textarea
                      {...register(`startCode.${index}.initialCode`)}
                      rows={8}
                      className="w-full bg-gray-800 text-white p-2 rounded font-mono"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4 — REFERENCE SOLUTIONS */}
          {activeTab === "solution" && (
            <motion.div key="solution" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-gray-900 p-6 rounded border border-gray-700 space-y-6">
                {["c++", "java", "javascript"].map((lang, index) => (
                  <div key={lang}>
                    <label className="text-gray-300 mb-2 block">{lang}</label>
                    <textarea
                      {...register(`referenceSolution.${index}.completeCode`)}
                      rows={10}
                      className="w-full bg-gray-800 text-white p-2 rounded font-mono"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button className="mt-8 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded">
          Update Problem
        </button>
      </form>
    </div>
  );
}

export default UpdateProblemPage;
