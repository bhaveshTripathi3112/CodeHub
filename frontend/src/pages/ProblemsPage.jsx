// src/pages/ProblemsPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axiosClient } from "../utils/axiosClient";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import ProblemsTable from "../components/ProblemsTable";

function ProblemsPage() {
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficultyLevel: "all",
    tag: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (error) {
        console.log("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(data);
      } catch (error) {
        console.log("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficultyLevel === "all" ||
      problem.difficultyLevel === filters.difficultyLevel;

    const tagMatch =
      filters.tag === "all" ||
      (Array.isArray(problem.tags)
        ? problem.tags.includes(filters.tag)
        : typeof problem.tags === "string"
        ? problem.tags.split(",").includes(filters.tag)
        : false);

    const isSolved = solvedProblems.some((sp) => sp._id === problem._id);
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved" && isSolved) ||
      (filters.status === "unsolved" && !isSolved);

    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Problems</h1>
          <p className="text-gray-400">
            Solve problems and track your progress
          </p>
        </div>
        <Filters filters={filters} setFilters={setFilters} />
        <ProblemsTable
          filteredProblems={filteredProblems}
          solvedProblems={solvedProblems}
        />
      </div>
    </div>
  );
}

export default ProblemsPage;
