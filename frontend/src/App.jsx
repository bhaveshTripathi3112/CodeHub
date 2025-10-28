import { Routes, Route } from "react-router";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Adminpanel from "./pages/Adminpanel";
import ProblemsPage from "./pages/ProblemsPage";
import SolveProblemPage from "./pages/SolveProblemPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar"; // ✅ Import Navbar

function App() {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Navbar always visible */}
      <Navbar />

      <Routes>
        {/* ✅ Always show HomePage */}
        <Route path="/" element={<HomePage />} />

        {/* ✅ Public Routes */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <HomePage />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <HomePage />}
        />

        {/* ✅ Authenticated Routes */}
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problem/:id" element={<SolveProblemPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* ✅ Admin Route */}
        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Adminpanel />
            ) : (
              <HomePage />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
