import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/admin_assets/assets";


const Login = ({ url, setToken, }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(url + "/api/user/admin-login", {
        email,
        password,
      });
      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        setToken(res.data.token);
        toast.success("Welcome back");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="  flex min-h-screen items-center justify-center bg-[#111111] px-4">
      <form
        onSubmit={onSubmit}
        className=" animate-fade-up w-full max-w-sm rounded-2xl border border-white/10 bg-[#1c1c1c] p-6 shadow-2xl sm:p-8"
      >
        
        
        <div className=" flex items-center justify-between">
         <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-500">
          Admin
        </p>

          {/* Close modal button - updates parent state to false */}
          <button
            type="button"
            onClick={() => window.location.href = "http://localhost:5173"}
            className="rounded-full p-2 transition hover:bg-white/10"
          >
            <img className="w-4" src={assets.cross_icon} alt="Close" />
          </button>
        </div>
        <h2 className="text-2xl mb-7 font-bold text-white">Sign up</h2>


        <div className="flex flex-col gap-4">
          <div className=' relative'>
            <img
              src={assets.mail_icon}
              alt="mail icon"
              className="absolute left-3 top-4 w-4 h-4 opacity-70"
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
              src={assets.lock_icon}
              alt="lock icon"
              className="absolute left-3 top-4 w-4 h-4 opacity-70"
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

          <button
            type="submit"
            disabled={loading}
             className=" shadow-lg border-solid
            border-2
             border-orange-900 transition-all mt-6 w-full rounded-lg
            bg-gradient-to-bl from-orange-800 to-black/20  p-3 font-semibold text-white hover:bg-gradient-to-br hover:from-orange-700 hover:to-black/20"
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;