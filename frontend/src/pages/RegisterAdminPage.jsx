import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import Toast from "../components/Toaster";

// validation schema
const adminRegisterSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters"),
  emailId: z
    .string()
    .email("Enter a valid email")
    .refine((val) => val.endsWith("@gmail.com") || val.endsWith("@gehu.ac.in"), {
      message: "Email must end with @gmail.com or @gehu.ac.in",
    }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function AdminRegister() {
  const navigate = useNavigate();
  const [toastData, setToastData] = useState({ message: "", type: "" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(adminRegisterSchema),
  });

  const onSubmit = async (data) => {
    try {
      const adminData = { ...data, role: "admin" };
      const res = await axios.post("http://localhost:8000/user/admin/register", adminData, {
        withCredentials: true,
    });


      if (res.data?.success) {
        setToastData({ message: "Admin registered successfully!", type: "success" });
        reset();
        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      } else {
        setToastData({ message: res.data?.message || "Registration failed", type: "error" });
      }
    } catch (error) {
      setToastData({
        message: error.response?.data?.message || "Something went wrong",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <AnimatePresence>
        {toastData.message && (
          <Toast
            message={toastData.message}
            type={toastData.type}
            onClose={() => setToastData({ message: "", type: "" })}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="card shadow-2xl w-full max-w-lg p-10 bg-base-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-extrabold text-center mb-8 text-primary">
          Admin Registration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-lg">
          <div>
            <input
              {...register("firstName")}
              type="text"
              placeholder="Enter first name"
              className="input input-bordered w-full p-4 text-lg"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("lastName")}
              type="text"
              placeholder="Enter last name"
              className="input input-bordered w-full p-4 text-lg"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("emailId")}
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full p-4 text-lg"
            />
            {errors.emailId && (
              <p className="text-red-500 text-sm mt-1">{errors.emailId.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full p-4 text-lg"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="btn btn-primary w-full text-xl py-3 mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register Admin"}
          </motion.button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/admin")}
            className="text-sm text-blue-400 hover:underline"
          >
            Back to Admin Panel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminRegister;
