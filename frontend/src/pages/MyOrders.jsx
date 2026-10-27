import React, { useContext, useEffect, useState } from "react";
import { StoreContex } from "../contex/StoreContex";
import axios from "axios";
import { assets } from "../assets/frontend_assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContex);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userOrders",
        {},
        {
          withCredentials: true,
        },
      );
      if (response.data.success) setData(response.data.data);
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
  fetchOrders();
}, []);

  const paymentLabel = (order) => {
    if (order.paymentMethod === "COD") {
      return order.payment ? "Paid (COD)" : "Cash on Delivery";
    }
    return "Paid Online";
  };

  return (
    <main className="min-h-screen bg-[#111111] px-4 py-10 text-white sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-8 border-b border-white/10 pb-6 sm:mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-orange-500">
            Your food journey
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Orders
          </h1>
          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            View your orders and check their current status.
          </p>
        </div>

        {data.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] px-5 py-16 text-center sm:py-20">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10">
              <img
                src={assets.parcel_icon}
                alt=""
                className="h-9 w-9 object-contain opacity-90"
              />
            </div>
            <h2 className="text-xl font-semibold text-white">No orders yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
              Your orders will appear here once you place one. Time to find
              something delicious!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {data.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-5 shadow-lg shadow-black/10 transition-colors duration-200 hover:border-white/20 sm:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
                      <img
                        src={assets.parcel_icon}
                        alt=""
                        className="h-8 w-8 object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                        Order items
                      </p>
                      <p className="break-words text-sm font-medium leading-6 text-white sm:text-base">
                        {order.items
                          .map((item) => `${item.name} x ${item.quantity}`)
                          .join(", ")}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                        <span>
                          Items:{" "}
                          <span className="font-medium text-white">
                            {order.items.length}
                          </span>
                        </span>
                        <span className="h-1 w-1 rounded-full bg-gray-600" />
                        <span>
                          Order ID:{" "}
                          <span className="text-gray-300">
                            {order._id.slice(-8).toUpperCase()}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-gray-600" />
                          <span>
                            Payment:{" "}
                            <span className="text-gray-300">
                              {paymentLabel(order)}
                            </span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-white/10 pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Total amount
                    </p>
                    <p className="text-2xl font-bold text-orange-500">
                      ₹{order.amount}.00
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                      Order status
                    </p>
                    <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                      <span className="text-sm font-semibold text-orange-400">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={fetchOrders}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 sm:w-auto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 7v5h-5M4 17v-5h5"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.5 9a7 7 0 0 1 11.8-2L20 12M4 12l2.7 5a7 7 0 0 0 11.8-2"
                      />
                    </svg>
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;
