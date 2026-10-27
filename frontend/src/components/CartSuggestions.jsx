import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { StoreContex } from '../contex/StoreContex'

const CartSuggestions = () => {
  const { url, token, cartItems, addToCart } = useContext(StoreContex)
  const [items, setItems] = useState([])
  const [reply, setReply] = useState("")

  const cartKey = Object.keys(cartItems || {})
    .filter((id) => cartItems[id] > 0)
    .sort()
    .join(",")

  useEffect(() => {
    if (!token || !cartKey) {
      setItems([])
      return
    }

    let cancelled = false

    const timer = setTimeout(async () => {
      try {
        const res = await axios.post(
          url + "/api/ai/recommend",
          { mode: "cart", cartItemIds: cartKey.split(",") },
          { headers: { token } }
        )

        if (!cancelled && res.data.success) {
          setItems(res.data.items || [])
          setReply(res.data.reply || "")
        }
      } catch {
        if (!cancelled) setItems([])
      }
    }, 800)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [cartKey, token, url])

  if (items.length === 0) return null

  return (
    <section className="mt-10 rounded-2xl border border-white/10 bg-[#1c1c1c] p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-xl text-orange-400">
          ✦
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
            AI picks
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            You may also like
          </h2>
        </div>
      </div>

      {reply && (
        <p className="mt-3 text-sm leading-6 text-gray-400">
          {reply}
        </p>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-[#111111] p-3 transition-colors duration-200 hover:border-orange-500/40"
          >
            <img
              src={url + "/images/" + item.image}
              alt={item.name}
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {item.name}
              </p>
              <p className="mt-1 text-sm font-bold text-orange-400">
                ₹{item.price}
              </p>
            </div>

            <button
              onClick={() => addToCart(item._id)}
              className="shrink-0 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-500"
            >
              Add +
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CartSuggestions