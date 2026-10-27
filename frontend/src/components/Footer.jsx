
import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const Footer = () => {
  return (
    <footer
  id="contact"
  className="mt-16 border-t border-white/10 bg-[#0b0b0b] px-[6%] pb-6 pt-12 text-gray-400">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] lg:gap-16">
        <div className="flex flex-col items-start gap-5">
          <img
            className="w-[130px] object-contain"
            src={assets.logo}
            alt="Logo"
          />

          <p className="max-w-md text-sm leading-7">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Maxime, repellat.
          </p>

          <div className="flex items-center gap-4">
            <img
              className="w-9 cursor-pointer transition hover:-translate-y-1"
              src={assets.facebook_icon}
              alt="Facebook"
            />
            <img
              className="w-9 cursor-pointer transition hover:-translate-y-1"
              src={assets.twitter_icon}
              alt="Twitter"
            />
            <img
              className="w-9 cursor-pointer transition hover:-translate-y-1"
              src={assets.linkedin_icon}
              alt="LinkedIn"
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-5">
          <h2 className="font-semibold tracking-wide text-white">
            COMPANY
          </h2>

          <ul className="flex flex-col gap-3 text-sm">
            <li className="cursor-pointer transition hover:text-orange-500">Home</li>
            <li className="cursor-pointer transition hover:text-orange-500">About</li>
            <li className="cursor-pointer transition hover:text-orange-500">Delivery</li>
            <li className="cursor-pointer transition hover:text-orange-500">Privacy Policy</li>
          </ul>
        </div>

        <div className="flex flex-col items-start gap-5">
          <h2 className="font-semibold tracking-wide text-white">
            GET IN TOUCH
          </h2>

          <ul className="flex flex-col gap-3 text-sm">
            <li>Mobile number</li>
            <li>Email</li>
          </ul>
        </div>
      </div>

      <hr className="mx-auto my-8 max-w-[1400px] border-white/10" />

      <p className="text-center text-xs text-gray-500 sm:text-sm">
        Copyright 2026 Tomato.com - All Rights Reserved.
      </p>
    </footer>
  )
}

export default Footer
