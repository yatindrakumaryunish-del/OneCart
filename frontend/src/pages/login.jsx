import React, { useState, useContext } from 'react'
import Logo from '../assets/OncartLogo.png'
import { useNavigate } from 'react-router-dom'
import GoogleLogo from '../assets/google.png'
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext.jsx'
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../../utils/Firebase"

function Login() {
  let navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  // 1. Context aur State variables
  const { serverUrl } = useContext(authDataContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // 2. Manual Login submit handler
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      )

      console.log("Login successfully!", result.data)
      navigate('/')
    } catch (error) {
      console.log("Login Error:", error.response?.data?.message || error.message)
      alert(error.response?.data?.message || "Login failed")
    }
  }

  // 3. Google Login handler (Backend se connected)
  const googleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      const user = response.user

      const result = await axios.post(
        `${serverUrl}/api/auth/google`,
        {
          name: user.displayName,
          email: user.email,
        },
        { withCredentials: true }
      )

      console.log("Google Login Success:", result.data)
      navigate('/')
    } catch (error) {
      console.log("Google Login Error:", error)
      alert("Google Sign-In failed")
    }
  }

  return (
    <div className='w-screen h-screen bg-gradient-to-b from-[#18181b] via-[#0f0f11] to-[#09090b] text-white flex flex-col'>
      
      {/* 1. Header Navbar */}
      <div 
        className='w-full h-[80px] flex items-center justify-start px-[30px] gap-[12px] cursor-pointer' 
        onClick={() => navigate('/')}
      >
        <img className='w-[50px] h-[50px] object-contain rounded-full' src={Logo} alt="OnCart Logo" />
        <h1 className='text-2xl font-bold tracking-wide'>OnCart</h1>
      </div>

      {/* 2. Main Center Wrapper */}
      <div className='flex-1 flex flex-col items-center justify-center -mt-8 gap-5'>
        
        {/* Top Text */}
        <div className='flex flex-col items-center gap-1 text-center'>
          <span className='text-[28px] font-bold tracking-wide'>Login Page</span>
          <span className='text-[15px] text-zinc-400'>Welcome back! Please enter your details.</span>
        </div>

        {/* Square Card */}
        <div className='max-w-[480px] w-[90%] bg-[#00000025] border border-[#96969635] backdrop-blur-2xl rounded-2xl flex flex-col items-center p-6 gap-4 shadow-2xl'>
          
          {/* Google Button (onClick added) */}
          <div 
            onClick={googleLogin}
            className='w-full h-[50px] bg-[#42656cae] hover:bg-[#42656c] transition-all rounded-lg flex items-center justify-center gap-[10px] cursor-pointer'
          >
            <img src={GoogleLogo} alt="Google" className='w-[20px] h-[20px] object-contain' />
            <span className='text-[15px] font-medium'>Sign in with Google</span>
          </div>

          {/* OR Divider */}
          <div className='w-full flex items-center justify-between my-1'>
            <div className='w-[44%] h-[1px] bg-[#96969640]'></div>
            <span className='text-xs text-zinc-400 font-medium'>OR</span>
            <div className='w-[44%] h-[1px] bg-[#96969640]'></div>
          </div>

          {/* Form Inputs Container */}
          <form onSubmit={handleLogin} className='w-full flex flex-col gap-3'>
            <input 
              type="email" 
              placeholder='Enter your email' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full h-[46px] bg-[#00000025] border border-[#96969635] rounded-lg px-4 text-white text-[15px] placeholder-zinc-500 focus:outline-none focus:border-[#42656c] transition-all'
            />

            {/* Password Input with Eye Button */}
            <div className='relative w-full flex items-center'>
              <input
                type={showPassword ? "text" : "password"}
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full h-[46px] bg-[#00000025] border border-[#96969635] rounded-lg pl-4 pr-11 text-white text-[15px] placeholder-zinc-500 focus:outline-none focus:border-[#42656c] transition-all'
              />
              <div 
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3.5 text-zinc-400 hover:text-white cursor-pointer select-none'
              >
                {showPassword ? (
                  <IoEyeOffOutline className='w-[20px] h-[20px]' />
                ) : (
                  <IoEyeOutline className='w-[20px] h-[20px]' />
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className='w-full h-[46px] mt-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all rounded-lg text-white font-medium text-[15px] cursor-pointer shadow-lg shadow-blue-600/20'
            >
              Login
            </button>

            <p className='w-full text-center text-sm text-zinc-400 mt-2'>
              Don't have an account?{' '}
              <span 
                onClick={() => navigate('/signup')} 
                className='text-[#42656c] hover:underline cursor-pointer font-medium'
              >
                Sign up
              </span>
            </p>
          </form>

        </div>

      </div>

    </div>
  )
}

export default Login