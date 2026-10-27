
import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const Header = () => {
  return (
    <div className="animate-fade-up relative mx-auto my-6 h-[380px] overflow-hidden rounded-2xl sm:h-[460px] lg:h-[520px]">
      <img
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={assets.header_img}
        alt="Delicious food"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

      <div className="absolute inset-y-0 left-0 flex max-w-[90%] flex-col items-start justify-center gap-5 px-6 sm:max-w-[65%] sm:px-12 lg:max-w-[55%] lg:px-16">
        <h2 className="text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          Order Your Favourite Food Here
        </h2>

        <p className="max-w-xl text-sm leading-6 text-gray-200 sm:text-base sm:leading-7">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Distinctio, omnis?
        </p>

        <button className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 sm:px-8">
          View Menu
        </button>
      </div>
    </div>
  )
}

export default Header
