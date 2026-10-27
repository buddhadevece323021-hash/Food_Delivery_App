import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/admin_assets/assets";
import axios from "axios";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Unable to fetch orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: e.target.value,
      });

      if (response.data.success) {
        toast.success("Order status updated");
        await fetchAllOrders();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating order status");
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-orange-500">
            Management
          </p>
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Orders
          </h3>
          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Manage customer orders and update delivery status.
          </p>
        </div>

        {/* Orders List */}
        <div className="flex flex-col gap-5">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="grid grid-cols-1 items-start gap-5 rounded-2xl border border-white/10 bg-[#1c1c1c] p-5 shadow-lg shadow-black/10 transition-colors duration-200 hover:border-orange-500/30 sm:p-6 lg:grid-cols-[60px_minmax(0,1fr)_190px]"
              >
                {/* Parcel Icon */}
                <div className="flex items-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                    <img
                      src={assets.parcel_icon}
                      alt="Order parcel"
                      className="h-7 w-7 object-contain"
                    />
                  </div>
                </div>

                {/* Order Information */}
                <div className="min-w-0 space-y-5">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Items Ordered
                    </p>
                    <p className="break-words text-sm font-medium leading-6 text-white">
                      {order.items.map((item, index) => (
                        <span key={index}>
                          {item.name} × {item.quantity}
                          {index !== order.items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#151515] p-4">
                    <p className="mb-2 text-base font-semibold text-white">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p className="text-sm leading-6 text-gray-400">
                      {order.address.street}, {order.address.city},{" "}
                      {order.address.state}, {order.address.pincode}
                    </p>
                    <p className="mt-2 text-sm text-gray-400">
                      <span className="text-gray-500">Phone:</span>{" "}
                      {order.address.phone}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-xs font-medium text-gray-300">
                      Items: {order.items.length}
                    </span>

                    <span className="rounded-lg bg-orange-500/10 px-3 py-2 text-sm font-semibold text-orange-500">
                      ₹{order.amount}
                    </span>
                                        <span
                      className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                        order.payment
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {order.paymentMethod === "COD"
                        ? order.payment
                          ? "COD - Collected"
                          : `COD - Collect ₹${order.amount}`
                        : "Paid Online"}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-3 border-t border-white/10 pt-5 lg:border-0 lg:pt-0">
                  <label
                    htmlFor={`status-${order._id}`}
                    className="text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    Order Status
                  </label>

                  <select
                    id={`status-${order._id}`}
                    onChange={(e) => statusHandler(e, order._id)}
                    value={order.status}
                    className="w-full cursor-pointer rounded-xl border border-white/10 bg-[#111111] px-3 py-3 text-sm text-white outline-none transition-colors duration-200 hover:border-orange-500/50 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="Food Processing">
                      Food Processing
                    </option>
                    <option value="Out for Delivery">
                      Out for Delivery
                    </option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  <p className="text-xs leading-5 text-gray-500">
                    Update the status as the order progresses.
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] px-5 py-16 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
                <img
                  src={assets.parcel_icon}
                  alt=""
                  className="h-7 w-7 object-contain"
                />
              </div>

              <h4 className="text-lg font-semibold text-white">
                No orders found
              </h4>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
                New customer orders will appear here when they are placed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;