import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  // Scroll blur effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-500 border-b ${
        isScrolled
          ? "bg-[#0a0c10]/70 backdrop-blur-lg border-gray-800 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
          : "bg-[#0a0c10]/40 backdrop-blur-md border-transparent"
      }`}
    >
      <div className="container mx-auto px-8 py-3 flex items-center justify-between">
        {/* Left - Logo */}
        <NavLink
          to="/"
          className="text-2xl font-extrabold tracking-wider text-blue-400 hover:text-blue-500"
        >
          <span className="text-white">Code</span>Hub
        </NavLink>

        {/* Center - Links */}
        <div className="hidden md:flex space-x-8 text-gray-300 font-medium">
          {["problems", "about", "discussion"].map((path) => (
            <NavLink
              key={path}
              to={`/${path}`}
              className={({ isActive }) =>
                `relative px-2 py-1 transition-all after:content-[''] after:absolute after:w-full after:h-[2px] after:left-0 after:bottom-0 after:bg-gradient-to-r from-blue-400 to-purple-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform ${
                  isActive ? "text-blue-400 after:scale-x-100" : "text-gray-300"
                }`
              }
            >
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </NavLink>
          ))}
        </div>

        {/* Right - User Section */}
        <div className="relative flex items-center space-x-3" ref={dropdownRef}>
          {user ? (
            <>
              {/* Avatar + Name */}
              <div
                className="flex items-center space-x-2 cursor-pointer select-none"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full 
                    bg-gradient-to-br from-blue-500 to-purple-600 text-white 
                    font-semibold text-lg shadow-[0_0_10px_rgba(100,100,255,0.4)]"
                >
                  {user?.firstName?.[0]?.toUpperCase() || "U"}
                </motion.div>
                <span className="text-sm font-medium text-gray-200">
                  {user?.firstName}
                </span>
              </div>

              {/* Dropdown */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-[60px] w-48 bg-[#151820]/95 border border-gray-700 
                      rounded-xl shadow-lg overflow-hidden backdrop-blur-xl z-50"
                  >
                    <NavLink
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                    >
                      Profile
                    </NavLink>

                    {/* Admin Option */}
                    {user?.role === "admin" && (
                      <NavLink
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
                      >
                        Admin Panel
                      </NavLink>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-red-400"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/login"
                className="px-4 py-1.5 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 
                text-white font-medium hover:opacity-90 transition"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="px-4 py-1.5 rounded-md border border-gray-700 text-gray-200 
                hover:bg-gray-800 transition font-medium"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
