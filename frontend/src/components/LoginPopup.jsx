
import React, { useState } from 'react'
import { assets } from '../assets';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { AppContext } from '../contex/AppContext';
import { toast } from 'react-toastify';
import { useContext } from 'react';

// 1. Component declaration accepting props
const LoginPopup = ({ setShowLogin }) => {

  // Switch between "Login" and "Sign Up"
  const [currState, setCurrState] = useState('Login');

  // Full name (only for Sign Up)
  const [name, setName] = useState("");
  // Email field     
  const [email, setEmail] = useState("");
  // Password field    
  const [password, setPassword] = useState("");

  // React Router navigation hook
  const navigate = useNavigate();

  // Context values from AppContext
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  // Form submit handler
  const onSubmitHandler = async (e) => {
    try {
      // Prevent page reload
      e.preventDefault();

      // Allow cookies with requests
      axios.defaults.withCredentials = true

      if (currState === 'Sign Up') {
        // Register new user
        const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })

        if (data.success) {
          toast.success(data.message);  // show success toast
          setIsLoggedin(true);   // Update login state
          await getUserData();   // Fetch user data
          setShowLogin(false);   // close popup
          navigate('/');         // Redirect to homepage
        } else {
          toast.error(data.message) // Show error message
        }
      } else {
        // Login existing user
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })

        if (data.success) {
          toast.success(data.message);  // show success toast
          setIsLoggedin(true);
          await getUserData();
          setShowLogin(false);
          navigate('/');
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      // Handle errors gracefully
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <>
      {/* 3. Dark backdrop overlay covering the full screen */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">

        {/* 4. Form container with a submit handler that prevents page refresh */}
        <form
          onSubmit={onSubmitHandler}
          className="animate-fade-up w-full max-w-md rounded-2xl border border-white/10 bg-[#1c1c1c] p-6 text-sm text-gray-300 shadow-2xl sm:p-8"
        >

          {/* Header section: Displays current state title and close button */}
          <div className="mb-7 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">{currState}</h2>

            {/* Close modal button - updates parent state to false */}
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="rounded-full p-2 transition hover:bg-white/10"
            >
              <img className="w-4" src={assets.frontend.cross_icon} alt="Close" />
            </button>
          </div>

          {/* Input fields container */}
          <div className="flex flex-col gap-4">

            {/* Conditional rendering: Only show Name field during 'Sign Up' */}
            {currState === 'Login' ? null : (
              <div className="relative">
                <img
                  src={assets.auth.person_icon}
                  alt="person icon"
                  className="absolute left-3 top-3 w-4 h-4 opacity-70"
                />
                <input
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#111111] p-3
                  pl-9
                  text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
                  type="text"
                  value={name}
                  placeholder="Your name"
                  required
                />
              </div>
            )}
            <div className=' relative'>
              <img
                src={assets.auth.mail_icon}
                alt="mail icon"
                className="absolute left-3 top-3.5 w-4 h-4 opacity-70"
              />
              <input
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#111111] p-3 pl-9 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
                type="email"
                value={email}
                placeholder="Your email"
                required
              />
            </div>
            <div className=' relative'>
              <img
                src={assets.auth.lock_icon}
                alt="lock icon"
                className="absolute left-3 top-3 w-4 h-4 opacity-70"
              />
              <input
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#111111] p-3 pl-9 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
                type="password"
                value={password}
                placeholder="Password"
                required
              />
            </div>
          </div>
          {/* Forgot password */}
          <p onClick={() => {
            navigate('/pass-reset');
            setShowLogin(false);
          }} className='mb-2 mt-2 text-indigo-500 cursor-pointer'> Forgot Password </p>


          {/* Dynamic button text based on state */}

          <button
            type="submit"
            className=" shadow-lg border-solid
            border-2
             border-orange-900 transition-all mt-6 w-full rounded-lg
            bg-gradient-to-bl from-orange-800 to-black/20  p-3 font-semibold text-white hover:bg-gradient-to-br hover:from-orange-700 hover:to-black/20"
          >
            {currState === 'Sign Up' ? 'Create account' : 'Login'}
          </button>

          {/* Terms of Use checkbox section */}

          <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-gray-400">
            <input className="mt-1 accent-orange-500" type="checkbox" required />
            <p>
              By continuing, you agree to our terms of use and privacy policy.
            </p>
          </div>

          {/* State Toggle Section: Toggles component between 'Login' and 'Sign Up' */}
          <p className="mt-6 text-sm text-gray-400">
            {currState === 'Login'
              ? 'Create a new account? '
              : 'Already have an account? '}

            <span
              className="cursor-pointer font-semibold text-orange-500 hover:text-orange-400"
              onClick={() =>
                setCurrState(currState === 'Login' ? 'Sign Up' : 'Login')
              }
            >
              {currState === 'Login' ? 'Click here' : 'Login here'}
            </span>
          </p>
        </form>
      </div>
    </>
  )
}

export default LoginPopup
