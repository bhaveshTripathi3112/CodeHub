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
import DiscussionPage from "./pages/DiscussionPage";
import CreateProblemPage from "./pages/CreateProblemPage";
import UpdateProblemPage from "./pages/UpdateProblemPage";
import DeleteProblemPage from "./pages/DeleteProblemPage";
import RegisterAdminPage from "./pages/RegisterAdminPage";
import AdminRoute from "./components/AdminRoute";
import TrackUsersPage from "./pages/TrackUsersPage";
import UserProfileForAdmin from "./pages/UserProfileForAdmin";

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
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/discussion" element={<DiscussionPage />} />

        {/* ✅ Admin Route */}
        
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Adminpanel />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/createProblem"
          element={
            <AdminRoute>
              <CreateProblemPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/updateProblem"
          element={
            <AdminRoute>
              <UpdateProblemPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/deleteProblem"
          element={
            <AdminRoute>
              <DeleteProblemPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/register"
          element={
            <AdminRoute>
              <RegisterAdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/trackUsers"
          element={
            <AdminRoute>
              <TrackUsersPage />
            </AdminRoute>
          }
        />
        <Route path="/admin/user/:id" element={<AdminRoute><UserProfileForAdmin /></AdminRoute>} /> 
      </Routes>
    </>
  );
}

export default App;
