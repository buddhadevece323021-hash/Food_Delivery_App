
import React from 'react'
import { useContext, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { StoreContex } from '../contex/StoreContex'

const FoodItems = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContex)
  return (
    <div className="food-card w-full">
      <div className="relative overflow-hidden">
        <img
          className="food-image transition duration-500 hover:scale-[1.03]"
          src={url+"/images/"+image}
          alt={name}
        />

        {!cartItems[id] ? (
          <img
            className="food-action absolute bottom-3 right-3 w-10 cursor-pointer rounded-full shadow-lg"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="Add to cart"
          />
        ) : (
          <div className="absolute bottom-3 right-3 flex items-center gap-3 rounded-full border border-gray-200 bg-white p-2 shadow-lg">
            <img
              className="food-action w-7 cursor-pointer"
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt="Remove item"
            />

            <p className="min-w-4 text-center font-semibold text-gray-900">
              {cartItems[id]}
            </p>

            <img
              className="food-action w-7 cursor-pointer"
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt="Add item"
            />
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <p className="text-base font-semibold leading-6 text-white sm:text-lg">
            {name}
          </p>

          <img
            className="mt-1 w-[65px] shrink-0 object-contain"
            src={assets.rating_starts}
            alt="Rating"
          />
        </div>

        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-gray-400">
          {description}
        </p>

        <p className="my-3 text-xl font-bold text-orange-500">
          ₹{price}
        </p>
      </div>
    </div>
  )
}

export default FoodItems
