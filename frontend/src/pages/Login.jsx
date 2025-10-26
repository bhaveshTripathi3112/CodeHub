import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import { motion } from "framer-motion";
import { loginUser } from '../authSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//schema validation for signup form


const allowedDomains = ["gmail.com","gehu.ac.in"];
const loginSchema = z.object({
    emailId: z
    .string()
    .email("Enter a valid email")
    .refine((val) => val.endsWith("@gmail.com") || val.endsWith("@gehu.ac.in"), {
      message: "Email must end with @gmail.com or @gehu.ac.in",
    }),
    password : z.string().min(8 , "Password should contain atleast 8 characters" )
})

function Login() {

  const dispatch = useDispatch()
  let navigate = useNavigate()
  const {isAuthenticated , loading , error} = useSelector((state)=>state.auth)

  const {
  register,
  handleSubmit,
  formState: { errors },
  } = useForm({resolver:zodResolver(loginSchema)});

  useEffect(()=>{
    if(isAuthenticated){
      navigate('/')
    }
  },[isAuthenticated , navigate])

  const submittedData = (data) => {
    dispatch(loginUser(data))
  }
      
  return (
      
    <div className="min-h-screen flex flex-col md:flex-row items-stretch justify-center bg-base-200">
    {/* Left Side - Full Image */}
    <motion.div
      className="hidden md:block md:w-1/2 h-screen"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <img
        src="https://media.istockphoto.com/id/1133924836/photo/programming-code-abstract-technology-background-of-software-developer-and-computer-script.jpg?s=612x612&w=0&k=20&c=qgSlKBhrhnDy48pBa54Y1muEQP18E2pfCsW88qSNGro="
        alt="Signup Illustration"
        className="w-full h-full object-cover"
      />
    </motion.div>

    {/* Right Side - Signup Form */}
    <motion.div
      className="w-full md:w-1/2 flex justify-center items-center bg-base-100"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="card shadow-2xl w-full max-w-lg p-10">
        <h2 className="text-5xl font-extrabold text-center mb-10 text-primary">
        Login to CodeHub
        </h2>

        <form onSubmit={handleSubmit(submittedData)} className="space-y-8 text-xl">
          {/* Email */}
          <div>
            <input
              {...register("emailId")}
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full text-xl p-4"
            />
            {errors.emailId && (
              <span className="text-red-500 text-lg">
                {errors.emailId.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full text-xl p-4"
            />
            {errors.password && (
              <span className="text-red-500 text-lg">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="btn btn-primary w-full text-xl py-4 mt-4"
          >
            Log In
          </motion.button>
        </form>

        <p className="text-center mt-10 text-lg">
          Create a new account?{" "}
          <span
            className="text-primary font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </motion.div>
  </div>
  )
}

export default Login

