import React, { useState, useContext } from 'react'
import Logo from '../assets/OncartLogo.png'
import { useNavigate } from 'react-router-dom'
import GoogleLogo from '../assets/google.png'
import { IoEyeOutline, IoEyeOffOutline, IoCloudyNight } from "react-icons/io5"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext.jsx'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../utils/Firebase';

function Registration() {
  let navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  let { serverUrl } = useContext(authDataContext)
  let [name, setName] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/registration`,
        {
          name: name,
          email: email,
          password: password,
        },
        { withCredentials: true }
      )
      console.log(result.data)
    } catch (error) {
      console.log("Backend Error Response",error.response?.data);
    }
  }
const googleSignup = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      console.log(response);
    } catch (error) {
      console.log("Google Signup Error:", error);
    }
  };
  return (
    <div className='w-screen h-screen bg-gradient-to-b from-[#18181b] via-[#0f0f11] to-[#09090b] text-white flex flex-col'>
      
      {/* 1. Header Navbar */}
      <div 
        className='w-full h-[80px] flex items-center justify-start px-[30px] gap-[12px] cursor-pointer' 
        onClick={() => navigate('/')}
      >
        <img className='w-[50px] h-[50px] object-contain rounded-full' src={Logo} alt="OnCart Logo" />
        <h1 className='text-2xl font-bold tracking-wide'>OneCart</h1>
      </div>

      {/* 2. Main Center Wrapper (Text upar + Card niche) */}
      <div className='flex-1 flex flex-col items-center justify-center -mt-8 gap-5'>
        
        {/* Top Text */}
        <div className='flex flex-col items-center gap-1 text-center'>
          <span className='text-[28px] font-bold tracking-wide'>Registration Page</span>
          <span className='text-[15px] text-zinc-400'>Welcome to OneCart, Place your order now!</span>
        </div>

        {/* Square Card */}
        <div className='max-w-[480px] w-[90%] bg-[#00000025] border border-[#96969635] backdrop-blur-2xl rounded-2xl flex flex-col items-center p-6 gap-4 shadow-2xl'>
          
          {/* Google Button */}
          <div className='w-full h-[50px] bg-[#42656cae] hover:bg-[#42656c] transition-all rounded-lg flex items-center justify-center gap-[10px] cursor-pointer'onClick={googleSignup}>
            <img src={GoogleLogo} alt="Google" className='w-[20px] h-[20px] object-contain' />
            <span className='text-[15px] font-medium'>Registration with Google</span>
          </div>

          {/* OR Divider */}
          <div className='w-full flex items-center justify-between my-1'>
            <div className='w-[44%] h-[1px] bg-[#96969640]'></div>
            <span className='text-xs text-zinc-400 font-medium'>OR</span>
            <div className='w-[44%] h-[1px] bg-[#96969640]'></div>
          </div>

          {/* Form Inputs Container */}
          <form onSubmit={handleSignup} className='w-full flex flex-col gap-3'>
            <input 
              type="text" 
              placeholder='Enter your username' 
              className='w-full h-[46px] bg-[#00000025] border border-[#96969635] rounded-lg px-4 text-white text-[15px] placeholder-zinc-500 focus:outline-none focus:border-[#42656c] transition-all'
              onChange={(e) => setName(e.target.value)} 
              value={name}
              required
            />
            <input 
              type="email" 
              placeholder='Enter your email' 
              className='w-full h-[46px] bg-[#00000025] border border-[#96969635] rounded-lg px-4 text-white text-[15px] placeholder-zinc-500 focus:outline-none focus:border-[#42656c] transition-all'
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
              required
            />

            {/* Password Input with Eye Button */}
            <div className='relative w-full flex items-center'>
              <input
                type={showPassword ? "text" : "password"}
                placeholder='Enter your password'
                className='w-full h-[46px] bg-[#00000025] border border-[#96969635] rounded-lg pl-4 pr-11 text-white text-[15px] placeholder-zinc-500 focus:outline-none focus:border-[#42656c] transition-all'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
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
              Create Account
            </button>

            <p className='w-full text-center text-sm text-zinc-400 mt-2'>
              You have any Account?{' '}
              <span 
                onClick={() => navigate('/login')} 
                className='text-[#42656c] hover:underline cursor-pointer font-medium'
              >
                Login here
              </span>
            </p>
          </form>

        </div>

      </div>

    </div>
  )
}

export default Registration