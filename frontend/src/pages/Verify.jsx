import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContex } from '../contex/StoreContex'
import axios from 'axios'

const Verify = () => {

  const [searchParams, setSreachParams] = useSearchParams()
  const success = searchParams.get("success")
  const orderId = searchParams.get("orderId")
  const { url } = useContext(StoreContex)
  const navigate = useNavigate()

  const verifyPayment = async () => {
    const response = await axios.post(url + "/api/order/verify", { success, orderId })
    if (response.data.success) {
      navigate("/myorders")
    }
    else {
      navigate("/")
    }
  }

  useEffect(() => {
    verifyPayment()
  }, [])

  return (
    <main className="grid min-h-[65vh] place-items-center bg-[#111111] px-4 py-16 text-white">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-7 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="h-24 w-24 animate-spin rounded-full border-4 border-transparent border-t-orange-500 border-r-orange-500/40" />
          <div className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.7"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold sm:text-2xl">
          Verifying Your Payment
        </h2>

        <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">
          Please wait while we confirm your payment. Do not refresh or close this page.
        </p>

        <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
          Secure payment verification
        </div>
      </div>
    </main>
  )
}

export default Verify
