import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);

      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (error) {
      toast.error("Unable to fetch food list");
      console.error(error);
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="admin-panel mx-auto w-full max-w-[1100px]">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          All Foods List
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Manage the food items available in your restaurant.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1b1b1b]">
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[0.7fr_1.8fr_1.2fr_0.8fr_0.5fr] items-center gap-4 border-b border-white/10 bg-[#202020] px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <p>Image</p>
              <p>Name</p>
              <p>Category</p>
              <p>Price</p>
              <p>Action</p>
            </div>

            {list.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-gray-500">
                No food items found.
              </div>
            ) : (
              list.map((items, index) => (
                <div
                  key={items._id || index}
                  className="grid grid-cols-[0.7fr_1.8fr_1.2fr_0.8fr_0.5fr] items-center gap-4 border-b border-white/5 px-5 py-3 text-sm text-gray-300 transition last:border-b-0 hover:bg-white/[0.03]"
                >
                  <img
                    className="h-12 w-12 rounded-lg border border-white/10 object-cover"
                    src={`${url}/images/${items.image}`}
                    alt={items.name}
                  />

                  <p className="font-medium text-white">{items.name}</p>

                  <p>
                    <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
                      {items.category}
                    </span>
                  </p>

                  <p className="font-semibold text-orange-400">
                    ₹{items.price}
                  </p>

                  <p
                    onClick={() => removeFood(items._id)}
                    className="w-fit rounded-md px-2 py-1 text-base text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
                  >
                    X
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Total food items: {list.length}
      </p>
    </div>
  );
};

export default List;
