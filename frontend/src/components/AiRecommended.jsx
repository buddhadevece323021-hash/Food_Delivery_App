import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { StoreContex } from '../contex/StoreContex'
import FoodItems from './FoodItems'

const AiRecommended = () => {
  const { url } = useContext(StoreContex)
  const [items, setItems] = useState([])
  const [reply, setReply] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
  
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const res = await axios.post(
          url + "/api/ai/recommend",
          { mode: "home" },
          { withCredentials: true }
        )

        if (!cancelled && res.data.success) {
          setItems(res.data.items || [])
          setReply(res.data.reply || "")
        }
      } catch {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [url])

  if ((!loading && items.length === 0)) return null

  return (
    <section className="mt-10 border-b border-white/5 pb-10 sm:mt-14 sm:pb-12">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-xl text-orange-400">
          ✦
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
            Made for you
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Recommended for you
          </h2>
        </div>
      </div>

      {reply && (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
          {reply}
        </p>
      )}

      {loading ? (
        <div className="mt-6 rounded-xl border border-white/10 bg-[#1c1c1c] px-4 py-5 text-sm text-gray-400">
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-orange-500" />
          Finding dishes you'll love...
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <FoodItems
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default AiRecommended