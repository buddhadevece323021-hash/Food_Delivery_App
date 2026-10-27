
import React, { useContext, useEffect, useState } from 'react'
import { StoreContex } from '../contex/StoreContex'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const PlaceOrder = () => {
  const { getTotalCartAmount, food_list, cartItems, setCartItems, url, cartLoading } = useContext(StoreContex);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: ""
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  };

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    });

  const placeOrder = async (e) => {
    e.preventDefault()
    if (loading) return

    const orderItems = food_list
      .filter((item) => Number(cartItems[item._id]) > 0)
      .map((item) => ({ _id: item._id, quantity: Number(cartItems[item._id]) }))

    if (orderItems.length === 0) {
      alert("Your cart is empty.")
      return
    }

    setLoading(true)
    try {
      if (paymentMethod === "ONLINE") {
        const loaded = await loadRazorpay()
        if (!loaded) {
          alert("Unable to load Razorpay. Please try again.")
          setLoading(false)
          return
        }
      }

      const response = await axios.post(
        url + "/api/order/place",
        { address: data, items: orderItems, paymentMethod },
        { withCredentials: true }
      );
      console.log(response.data);

      if (!response.data.success) {
        alert(response.data.message || "Unable to create order.")
        setLoading(false)
        return
      }

      // ---------- Cash on Delivery ----------
      if (response.data.cod) {
        setCartItems({})
        alert("Order placed! Please pay cash on delivery.")
        setLoading(false)
        navigate("/myorders")
        return
      }

      // ---------- Online payment ----------
      const { key, orderId, amount, currency } = response.data

      if (!key || !orderId) {
        alert("Razorpay configuration is missing.")
        setLoading(false)
        return
      }

      const options = {
        key,
        order_id: orderId,
        amount,
        currency,
        name: "Food Delivery",
        description: "Food order payment",
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone,
        },
        theme: { color: "#ea580c" },

        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await axios.post(
              url + "/api/order/verify",
              paymentResponse,
              { withCredentials: true }
            )
            if (verifyResponse.data.success) {
              setCartItems({})
              alert("Payment successful!")
              navigate("/myorders")
            } else {
              alert(verifyResponse.data.message || "Payment verification failed.")
            }
          } catch (error) {
            alert(
              error.response?.data?.message ||
              "Could not verify payment. If money was deducted, contact support."
            )
          } finally {
            setLoading(false)
          }
        },

        modal: { ondismiss: () => setLoading(false) },
      }

      const rzp = new window.Razorpay(options)
      rzp.on("payment.failed", (res) => {
        alert(res.error?.description || "Payment failed. Please try again.")
        setLoading(false)
      })
      rzp.open()
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Unable to place order.")
      setLoading(false)
    }
  };

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(
          url + "/api/auth/is-auth",
          { withCredentials: true }
        );
      } catch (error) {
        navigate("/login");
      }
    };

    checkAuth();
  }, [url, navigate]);

  // Redirect if cart is empty
 useEffect(() => {
  if (!cartLoading && getTotalCartAmount() === 0) {
    navigate("/cart");
  }
  }, [cartLoading, cartItems, navigate]);
  
  const inputClass =
    'w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500'

  const subtotal = getTotalCartAmount()
  const delivery = subtotal > 0 ? 30 : 0

  return (
    <main className="min-h-screen bg-[#111111] px-4 py-10 animate-fade-up sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-8 sm:mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-orange-500">
            Almost there
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Add your delivery details and review your order.
          </p>
        </div>

        <form
          onSubmit={placeOrder}
          className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8"
        >
          {/* Delivery information */}
          <section className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-5 shadow-lg shadow-black/10 sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-bold text-white">Delivery Information</h2>
              <p className="mt-1 text-sm text-gray-400">Where should we deliver your food?</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input name="firstName" onChange={onChangeHandler} value={data.firstName} className={inputClass} type="text" placeholder="First Name" required />
                <input name="lastName" onChange={onChangeHandler} value={data.lastName} className={inputClass} type="text" placeholder="Last Name" required />
              </div>

              <input name="email" onChange={onChangeHandler} value={data.email} className={inputClass} type="email" placeholder="Email address" required />
              <input name="street" onChange={onChangeHandler} value={data.street} className={inputClass} type="text" placeholder="Street / House address" required />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input name="city" onChange={onChangeHandler} value={data.city} className={inputClass} type="text" placeholder="City" required />
                <input name="state" onChange={onChangeHandler} value={data.state} className={inputClass} type="text" placeholder="State" required />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  name="pincode"
                  onChange={onChangeHandler}
                  value={data.pincode}
                  className={inputClass}
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="PIN Code"
                  required
                />
                <input name="phone" onChange={onChangeHandler} value={data.phone} className={inputClass} type="tel" placeholder="Phone Number" required />
              </div>
            </div>
          </section>

          {/* Cart total + payment method */}
          <section className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-5 shadow-lg shadow-black/10 sm:p-8 lg:sticky lg:top-24">
            <div className="mb-7">
              <h2 className="text-xl font-bold text-white">Cart Total</h2>
              <p className="mt-1 text-sm text-gray-400">Order payment summary</p>
            </div>

            <div className="space-y-5 text-sm">
              <div className="flex items-center justify-between gap-4 text-gray-400">
                <p>Subtotal</p>
                <p className="font-medium text-white">₹{subtotal}</p>
              </div>

              <div className="border-t border-white/10" />

              <div className="flex items-center justify-between gap-4 text-gray-400">
                <p>Delivery Fee</p>
                <p className="font-medium text-white">₹{delivery}</p>
              </div>

              <div className="border-t border-white/10" />

              <div className="flex items-center justify-between gap-4 pt-1">
                <p className="text-base font-semibold text-white">Total</p>
                <p className="text-2xl font-bold text-orange-500">₹{subtotal + delivery}</p>
              </div>
            </div>

            {/* Payment method */}
            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold text-white">Payment Method</p>

              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${paymentMethod === "ONLINE" ? "border-orange-500 bg-orange-500/10 text-white" : "border-white/10 text-gray-400 hover:border-white/20"
                }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-orange-500"
                />
                Online Payment (UPI / Card / Netbanking)
              </label>

              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${paymentMethod === "COD" ? "border-orange-500 bg-orange-500/10 text-white" : "border-white/10 text-gray-400 hover:border-white/20"
                }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-orange-500"
                />
                Cash on Delivery
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-4 font-semibold text-white shadow-lg shadow-orange-950/20 transition-colors duration-200 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#1c1c1c] active:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Please wait..." : paymentMethod === "COD" ? "Place Order" : "Proceed to Payment"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              Please review your delivery information before continuing.
            </p>
          </section>
        </form>
      </div>
    </main>
  )
}

export default PlaceOrder