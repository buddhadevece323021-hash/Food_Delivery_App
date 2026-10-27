import React from 'react'

import { useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets';
import { AppContext } from '../contex/AppContext';

const ResetPassword = ({ setShowLogin }) => {
  // Allow cookies and session headers to be sent with cross-origin API requests
  axios.defaults.withCredentials = true;

  // Global backend context URL
  const { backendUrl } = useContext(AppContext)

  // UI visibility state for masking/unmasking the plain-text password
  const [showPassword, setShowPassword] = useState(false);

  // Workflow tracking states (hydrated from sessionStorage to persist user journey on refresh)
  const [isEmailSent, setIsEmailSent] = useState(
    sessionStorage.getItem('resetEmailSent') === 'true'
  );

  const [isOtpSubmited, setIsOtpSubmited] = useState(
    sessionStorage.getItem('resetOtpSubmitted') === 'true'
  );

  // Input states (persisted via storage where needed to preserve progress)
  const [email, setEmail] = useState(
    sessionStorage.getItem('resetEmail') || ''
  );
  const [otp, setOtp] = useState(
    sessionStorage.getItem('resetOtp') || ''
  );
  const [newPassword, setNewPassword] = useState('');

  const navigate = useNavigate();

  const inputRefs = React.useRef([]);

  // Auto-focus next input field on entering a valid digit
  const handelInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  // Reverse-focus previous entry if user removes a digit via Backspace
  const handelKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  // Clip and inject system clipboard copy strings cleanly into separate multi-box forms
  const handelPaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  }

  // Step 1: Submit entry validation and trigger API to send verification code
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-Otp', { email })
      if (data.success) {
        toast.success(data.message);

        setIsEmailSent(true);

        // Sync stage locally to defend against reload wipes
        sessionStorage.setItem('resetEmailSent', 'true');
        sessionStorage.setItem('resetEmail', email);
      } else { toast.error(data.message) }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // Step 2: Extract ref values, check length, and lock structure prior to submission
  const onSubmitOtp = (e) => {
    e.preventDefault();

    const otpArray = inputRefs.current.map(input => input?.value || '');
    const enteredOtp = otpArray.join('');

    if (enteredOtp.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setOtp(enteredOtp);
    setIsOtpSubmited(true);

    sessionStorage.setItem('resetOtp', enteredOtp);
    sessionStorage.setItem('resetOtpSubmitted', 'true');
  };
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-pass', { email, otp, newPassword });
      if (data.success) {
        toast.success(data.message);

        // Clear sessionStorage
        sessionStorage.removeItem('resetEmailSent');
        sessionStorage.removeItem('resetOtpSubmitted');
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('resetOtp');

        setShowLogin(true);
        navigate('/');
      } else { toast.error(data.message) }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const savedOtp = sessionStorage.getItem('resetOtp');

    if (savedOtp && inputRefs.current.length === 6) {
      savedOtp.split('').forEach((char, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = char;
        }
      });
    }
  }, [isEmailSent]);


  return (
    <div className="fixed inset-0 z-50 flex items-center transition-all animate-fade-up justify-center bg-black/75 p-4 backdrop-blur-sm">

{/* Universal Branding Header Logo redirection root link */}
      <img onClick={() => navigate('/')} src={assets.auth.logo} alt="auth logo"
        className=' active:scale-95 transition-all absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />

{/*----------------------- Email input form  ------------------*/}

      {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='bg-slate-900 pt-2 p-8 rounded-lg border border-white/30 animate-fade-up transition-all shadow-lg w-96 text-sm '>

          <div className='p-2 flex flex-row-reverse '>
            <button onClick={() => {
              sessionStorage.removeItem('resetEmailSent');
              sessionStorage.removeItem('resetOtpSubmitted');
              sessionStorage.removeItem('resetEmail');
              sessionStorage.removeItem('resetOtp');
              setShowLogin(true);
              navigate('/');
            }} className="  rounded-full active:scale-90 p-2 transition-all hover:bg-white/10">
              <img src={assets.frontend.cross_icon} alt="cross icon" />
            </button>
          </div>

          <h1 className='text-green-300 text-2xl font-semibold text-center mb-4'> Reset Password </h1>
          <p className='text-center mb-6 text-indigo-300 '> Enter Your Register Email </p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full  bg-[#333A5C] '>
            <img src={assets.auth.mail_icon} alt="mail icon" className='w-4 h-4' />
            <input
              type="email"
              placeholder='Enter Email'
              className='bg-transparent autofill:bg-transparent outline-none text-white flex-1 min-w-0'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required />
          </div>

          <button className=' w-full py-3  rounded-full
           bg-gradient-to-tl from-green-500 to-green-900 text-white  font-medium cursor-pointer'> Submit </button>
        </form>
      }

{/*----------------------- OTP input form  ------------------*/}

      {!isOtpSubmited && isEmailSent &&
        < form onSubmit={onSubmitOtp} className='bg-slate-900 pt-2 p-8 rounded-lg border border-white/30  shadow-lg w-96 text-sm '>
          <div className='p-2 flex flex-row-reverse '>
            <button onClick={() => {
              sessionStorage.removeItem('resetEmailSent');
              sessionStorage.removeItem('resetOtpSubmitted');
              sessionStorage.removeItem('resetEmail');
              sessionStorage.removeItem('resetOtp');
              setShowLogin(true);
              navigate('/');
            }} className="  rounded-full active:scale-90 p-2 transition-all hover:bg-white/10">
              <img src={assets.frontend.cross_icon} alt="cross icon" />
            </button>
          </div>
          <h1 className='text-green-300 text-2xl font-semibold text-center mb-4'> Reset Password OTP </h1>
          <p className='text-center mb-6 text-indigo-300 '> Enter the 6-digit code sent to your email id </p>
          <div className=' flex justify-between mb-8 ' onPaste={handelPaste}>
            {Array(6).fill(0).map((_, index) => (
              <input type="text" maxLength='1' key={index} required autoComplete="new-password"
                inputMode="numeric" className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md ' ref={e => inputRefs.current[index] = e}
                onInput={(e) => handelInput(e, index)}
                onKeyDown={(e) => handelKeyDown(e, index)} />
            ))}
          </div>
          <button className='w-full py-2.5  rounded-full bg-gradient-to-tl from-green-500 to-green-900 text-white font-medium cursor-pointer'>Verify OTP</button>
        </form>
      }

      {/*----------------------- Enter New Password form  ------------------*/}

      {isOtpSubmited && isEmailSent &&
        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 pt-2 p-8 rounded-lg border border-white/30  shadow-lg w-96 text-sm '>

          <div className='p-2 flex flex-row-reverse '>
            <button 
            onClick={() => {
              sessionStorage.removeItem('resetEmailSent');
              sessionStorage.removeItem('resetOtpSubmitted');
              sessionStorage.removeItem('resetEmail');
              sessionStorage.removeItem('resetOtp');
              setShowLogin(true);
              navigate('/');
            }} 
            className="  rounded-full active:scale-90 p-2 transition-all hover:bg-white/10">
              <img src={assets.frontend.cross_icon} alt="cross icon" />
            </button>
          </div>

          <h1 className='text-green-300 text-2xl font-semibold text-center mb-4'> New Password </h1>
          <p className='text-center mb-6 text-indigo-300 '> Enter Your New Password </p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full  bg-[#333A5C] '>
            <img src={assets.auth.lock_icon} alt="" className='w-4 h-4' />
            <input
              onChange={e => setNewPassword(e.target.value)}
              value={newPassword}
              className='bg-transparent outline-none text-white  flex-1 min-w-0'
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              required
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='text-gray-300 hover:text-white cursor-pointer text-sm'
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button 
          className='w-full py-3  rounded-full bg-gradient-to-tl from-green-500 to-green-900 text-white font-medium cursor-pointer'> Submit </button>
        </form>
      }

    </div >

  )
}

export default ResetPassword