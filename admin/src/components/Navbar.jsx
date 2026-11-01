import React from 'react'
import { assets } from '../assets/admin_assets/assets'

const Navbar = ({ onLogout }) => {
  return (
    <header className="sticky top-0 z-40 flex h-[73px] items-center justify-between border-b border-white/10 bg-[#161616]/95 px-5 backdrop-blur-md sm:px-8 lg:px-10">
      <img
        className="w-[110px] cursor-pointer object-contain sm:w-[135px]"
        src={assets.logo}
        alt="Admin logo"
      />

      <div className="flex items-center gap-3">
        <span className="hidden text-lg text-gray-400 sm:block">
          Admin Panel
        </span>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-200 transition hover:border-orange-500 hover:text-orange-400"
        >
          Logout
        </button>

        <img
          className="h-12 w-12 rounded-full border border-white/10 bg-[#252525] object-cover p-0.5"
          src={assets.profile_image}
          alt="Admin profile"
        />
      </div>
    </header>
  )
}

export default Navbar