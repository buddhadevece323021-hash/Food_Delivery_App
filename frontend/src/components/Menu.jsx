
import React from 'react'
import { menu_list } from '../assets/frontend_assets/assets'

const Menu = ({ category, setCategory }) => {
  return (
    <div id="menu" className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold text-white sm:text-3xl">
        Explore our menu
      </h1>

      <p className="max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
        Choose a category to explore your favourite food.
      </p>

      <div className="my-3 flex items-start gap-5 overflow-x-auto overflow-y-hidden px-1 pb-4 sm:gap-8">
        {menu_list.map((item, index) => (
          <div
            key={index}
            onClick={() =>
              setCategory(prev =>
                prev === item.menu_name ? 'All' : item.menu_name
              )
            }
            className="group flex min-w-[76px] shrink-0 cursor-pointer flex-col items-center text-center sm:min-w-[100px]"
          >
            <img
              className={`h-[76px] w-[76px] rounded-full border-2 object-cover transition-all duration-300 group-hover:scale-105 sm:h-[100px] sm:w-[100px] ${
                category === item.menu_name
                  ? 'border-orange-500 p-1'
                  : 'border-transparent group-hover:border-orange-500/50'
              }`}
              src={item.menu_image}
              alt={item.menu_name}
            />

            <p
              className={`mt-3 text-sm transition-colors sm:text-base ${
                category === item.menu_name
                  ? 'font-semibold text-orange-500'
                  : 'text-gray-400 group-hover:text-white'
              }`}
            >
              {item.menu_name}
            </p>
          </div>
        ))}
      </div>

      <hr className="border-0 border-t border-white/10" />
    </div>
  )
}

export default Menu
