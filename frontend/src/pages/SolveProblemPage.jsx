// src/pages/SolveProblemPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import { axiosClient } from "../utils/axiosClient";

const languageOptions = ["c++", "java", "javascript"];

export default function SolveProblemPage() {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("c++");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState("description"); // description | submissions | solution
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null); // result of last SUBMIT
  const [testCaseResults, setTestCaseResults] = useState([]); // array of booleans: true = passed
  const [hasAccepted, setHasAccepted] = useState(false);
  const [activeTestCase, setActiveTestCase] = useState(0);

  // fetch problem once
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosClient.get(`/problem/ProblemById/${id}`);
        const prob = res.data;
        setProblem(prob);

        // load starter code for default language (c++)
        const start = prob.startCode?.find(
          (s) => s.language.toLowerCase() === "c++"
        );
        if (start) setCode(start.initialCode);
      } catch (err) {
        console.error("Error fetching problem:", err);
      }
    };
    fetchProblem();
  }, [id]);

  // fetch submissions (when user opens the tab or after submit)
  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const res = await axiosClient.get(`/problem/submittedProblem/${id}`);
      const subs = Array.isArray(res.data)
        ? res.data
        : res.data.submissions || [];
      setSubmissions(subs);

      // if any accepted previously, allow solution tab
      if (subs.some((s) => s.status === "accepted")) {
        setHasAccepted(true);
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const start = problem.startCode?.find(
      (s) => s.language.toLowerCase() === lang.toLowerCase()
    );
    if (start) setCode(start.initialCode);
  };

  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setOutput("");
      const res = await axiosClient.post(`/submission/run/${id}`, {
        code,
        language,
      });
      const data = res.data;

      if (data.errorMessage) {
        setOutput(`Error: ${data.errorMessage}`);
        setTestCaseResults([]);
      } else {
        setOutput(
          `Status: ${data.status}\nTest Cases Passed: ${data.testCasesPassed}/${data.testCasesTotal}\nRuntime: ${data.runtime} sec\nMemory: ${data.memory} KB`
        );

        const total = data.testCasesTotal ?? problem.visibleTestCases.length;
        const passed = data.testCasesPassed ?? 0;
        const resultsArray = Array.from({ length: total }, (_, i) => i < passed);
        setTestCaseResults(resultsArray);
      }
    } catch (err) {
      console.error(err);
      setOutput("Error executing code");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmissionResult(null);
      const res = await axiosClient.post(`/submission/submit/${id}`, {
        code,
        language,
      });
      const data = res.data;
      setSubmissionResult(data);

      const total = data.testCasesTotal ?? problem.visibleTestCases.length;
      const passed = data.testCasesPassed ?? 0;
      const resultsArray = Array.from({ length: total }, (_, i) => i < passed);
      setTestCaseResults(resultsArray);

      if (data.status === "accepted") {
        setHasAccepted(true);
      }

      setSubmissions((prev) => (data ? [data, ...prev] : prev));
    } catch (err) {
      console.error("Submit error:", err);
      setSubmissionResult({
        status: "error",
        errorMessage: "Submission failed. Try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewSubmission = (submission) => {
    if (!submission) return;
    setCode(submission.code);
    setSelectedSubmission(submission);
    setSubmissionResult(submission);

    const total = submission.testCasesTotal ?? problem.visibleTestCases.length;
    const passed = submission.testCasesPassed ?? 0;
    const resultsArray = Array.from({ length: total }, (_, i) => i < passed);
    setTestCaseResults(resultsArray);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!problem) return <p className="p-6 text-gray-300">Loading problem...</p>;

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-200 flex flex-col md:flex-row">
      {/* LEFT PANEL */}
      <motion.div
        className="md:w-1/2 border-r border-gray-800 p-6 overflow-y-auto"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex gap-3 mb-4">
          {["description", "submissions", "solution"].map((tab) => (
            <button
              key={tab}
              disabled={tab === "solution" && !hasAccepted}
              onClick={() => {
                setActiveTab(tab);
                if (tab === "submissions") fetchSubmissions();
              }}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : tab === "solution" && !hasAccepted
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Description */}
        {activeTab === "description" && (
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-2xl font-bold text-yellow-400">
              {problem.title}
            </h1>
            <p className="text-gray-300 whitespace-pre-line" style={{ whiteSpace: "pre-line" }}>
              {problem.description}
            </p>

            <p className="text-sm text-gray-400">
              Difficulty:{" "}
              <span
                className={
                  problem.difficultyLevel === "easy"
                    ? "text-green-400"
                    : problem.difficultyLevel === "medium"
                    ? "text-yellow-400"
                    : "text-red-400"
                }
              >
                {problem.difficultyLevel}
              </span>
            </p>

            <h3 className="text-lg font-semibold text-green-400 mt-4">
              Example Test Cases
            </h3>
            {problem.visibleTestCases?.map((t, i) => (
              <div
                key={i}
                className="bg-[#1a1c23] border border-gray-700 p-3 rounded-md"
              >
                <p className="text-sm mb-2">
                  <strong>Input:</strong>
                  <div className="whitespace-pre-wrap text-gray-200 bg-gray-800 rounded-lg p-2 mt-1">
                    {String(t.input)}
                  </div>
                </p>

                <p className="text-sm mb-2">
                  <strong>Expected Output:</strong>
                  <p className="whitespace-pre-wrap text-gray-200 bg-gray-800 rounded-lg p-2 mt-1">
                    {String(t.output)}
                  </p>
                </p>

                {t.explanation && (
                  <p className="text-xs text-gray-400 mt-1">
                    {t.explanation}
                  </p>
                )}
              </div>

            ))}
          </motion.div>
        )}

        {/* Submissions */}
        {activeTab === "submissions" && (
          
          <div className="bg-[#0e1117] p-6 rounded-2xl border border-gray-800 shadow-lg">
            {/* Header */}
            <h2 className="text-2xl font-semibold mb-5 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Your Submissions
            </h2>

            {loadingSubmissions ? (
              <p className="text-gray-400 animate-pulse">Loading submissions...</p>
            ) : submissions.length > 0 ? (
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <div
                    key={submission._id}
                    onClick={() => handleViewSubmission(submission)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer 
                      ${
                        selectedSubmission?._id === submission._id
                          ? "border-blue-500 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                          : "border-gray-800 hover:border-gray-700 hover:bg-[#1a1d25]"
                      }`}
                  >
                    {/* Top Row - Status and Date */}
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            submission.status === "accepted"
                              ? "bg-green-600/20 text-green-400 border border-green-500/30"
                              : submission.status === "runtime error"
                              ? "bg-yellow-600/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-red-600/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {submission.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(submission.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Middle Row - Details */}
                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <div>
                        <p>
                          <span className="text-gray-400">Runtime:</span>{" "}
                          <span className="font-medium text-white">
                            {submission.runtime}s
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-400">Memory:</span>{" "}
                          <span className="font-medium text-white">
                            {submission.memory}KB
                          </span>
                        </p>
                      </div>

                      <div className="text-gray-400 text-xs italic">
                        Language:{" "}
                        <span className="text-gray-200 font-medium">
                          {submission.language || "C++"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <p className="text-gray-400 text-sm mb-2">
                  You haven’t submitted any solutions yet.
                </p>
                <p className="text-gray-500 text-xs">
                  Solve the problem and view your submissions here!
                </p>
              </div>
            )}
          </div>
        )}


        {/* Solution */}
        {activeTab === "solution" && hasAccepted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold text-green-400 mb-3">
              Solution
            </h2>
            <pre className="bg-[#0b0d10] border border-gray-800 p-3 rounded text-sm whitespace-pre-wrap overflow-x-auto">
              {(() => {
                if (!problem.referenceSolution)
                  return "No solution available.";
                const sol = problem.referenceSolution.find(
                  (r) =>
                    r.language?.toLowerCase() === language.toLowerCase() ||
                    (r.language === "c++" && language === "c++")
                );
                return sol
                  ? sol.completeCode
                  : JSON.stringify(problem.referenceSolution, null, 2);
              })()}
            </pre>
          </motion.div>
        )}
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        className="md:w-1/2 flex flex-col p-6 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Language + buttons */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-3">
            {languageOptions.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1 rounded-md text-sm ${
                  language === lang
                    ? "bg-blue-600 text-white"
                    : "bg-[#1a1c23] text-gray-300"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className={`px-4 py-2 rounded-md text-white ${
                isRunning ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isRunning ? "Running..." : "Run Code"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-white ${
                isSubmitting ? "bg-gray-600" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <Editor
            height="50vh"
            theme="vs-dark"
            language={
              language === "c++"
                ? "cpp"
                : language === "javascript"
                ? "javascript"
                : "java"
            }
            value={code}
            onChange={(value) => setCode(value)}
            options={{ automaticLayout: true }}
          />
        </div>

       {/* Sample test cases with navbar tabs */}
        <div className="mt-6">
          <h3 className="text-md font-semibold text-blue-400 mb-3">
            Sample Test Cases
          </h3>

          {/* State to handle active tab */}
          {problem.visibleTestCases?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {problem.visibleTestCases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestCase(i)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTestCase === i
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Test Case {i + 1}
                </button>
              ))}
            </div>
          )}

          {/* Display active test case */}
          {problem.visibleTestCases?.[activeTestCase] && (() => {
            const t = problem.visibleTestCases[activeTestCase];
            const passed =
              testCaseResults.length > 0 && testCaseResults[activeTestCase] === true;
            const failed =
              testCaseResults.length > 0 && testCaseResults[activeTestCase] === false;

            return (
              <motion.div
                key={activeTestCase}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-md p-3 mb-3 transition ${
                  passed
                    ? "bg-green-900/20 border-green-500"
                    : failed
                    ? "bg-red-900/20 border-red-500"
                    : "bg-[#1a1c23] border-gray-700"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm mb-2">
                      <strong>Input:</strong>
                      <div className="whitespace-pre-wrap text-gray-200 bg-gray-800 rounded-md p-2 mt-1">
                        {String(t.input)}
                      </div>
                    </p>

                    <p className="text-sm mb-2">
                      <strong>Expected Output:</strong>
                      <pre className="whitespace-pre-wrap text-gray-200 bg-gray-800 rounded-md p-2 mt-1">
                        {String(t.output)}
                      </pre>
                    </p>

                    {t.explanation && (
                      <p className="text-xs text-gray-400 mt-1">
                        {t.explanation}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${
                        passed
                          ? "text-green-300"
                          : failed
                          ? "text-red-300"
                          : "text-gray-400"
                      }`}
                    >
                      {testCaseResults.length === 0
                        ? "Not run"
                        : passed
                        ? "Passed"
                        : "Failed"}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </div>


        {/* Output */}
        {output && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 bg-[#1a1c23] border border-gray-700 p-3 rounded"
          >
            <h4 className="text-md font-semibold text-yellow-400 mb-2">
              Output
            </h4>
            <pre className="bg-[#0f1117] p-2 rounded text-sm overflow-x-auto whitespace-pre-wrap">
              {output}
            </pre>
          </motion.div>
        )}

        {/* Submission result */}
        {submissionResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 bg-[#1a1c23] border border-gray-700 p-4 rounded"
          >
            <h4 className="text-md font-semibold text-green-400 mb-2">
              Submission Result
            </h4>

            <p className="text-sm">
              <strong>Status:</strong>{" "}
              <span
                className={
                  submissionResult.status === "accepted"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {submissionResult.status}
              </span>
            </p>

            {submissionResult.errorMessage && (
              <p className="text-sm text-red-400 mt-1">
                {submissionResult.errorMessage}
              </p>
            )}

            <div className="mt-2 text-sm">
              <p>
                <strong>Runtime:</strong> {submissionResult.runtime ?? "-"} sec
              </p>
              <p>
                <strong>Memory:</strong> {submissionResult.memory ?? "-"} KB
              </p>
              <p>
                <strong>Test Cases Passed:</strong>{" "}
                {submissionResult.testCasesPassed ?? 0}/
                {submissionResult.testCasesTotal ??
                  problem.visibleTestCases.length}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
