import React from "react";
import { assets } from "../assets/admin_assets/assets";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    const response = await axios.post(`${url}/api/food/add`, formData);
    if (response.data.success) {
      setData({
        name: "",
        description: "",
        price: "",
        category: "Salad",
      });
      setImage(false);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="admin-panel mx-auto w-full max-w-[850px]">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Add New Item
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Add a food item to your restaurant menu.
        </p>
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="space-y-6 rounded-2xl border border-white/10 bg-[#1b1b1b] p-5 sm:p-8"
      >
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-200">Upload Image</p>

          <label
            htmlFor="image"
            className="flex h-36 w-full max-w-[220px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-600 bg-[#141414] transition hover:border-orange-500 hover:bg-orange-500/5"
          >
            <img
              className="max-h-full max-w-full object-contain p-4"
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload food image"
            />
          </label>

          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-200"
          >
            Product Name
          </label>

          <input
            onChange={onChangeHandler}
            value={data.name}
            className="admin-input"
            id="name"
            type="text"
            name="name"
            placeholder="Type here"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-200"
          >
            Product Description
          </label>

          <textarea
            onChange={onChangeHandler}
            value={data.description}
            className="admin-input resize-y"
            id="description"
            name="description"
            rows="5"
            placeholder="Describe the food item..."
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-200"
            >
              Product Category
            </label>

            <select
              onChange={onChangeHandler}
              value={data.category}
              className="admin-input cursor-pointer"
              id="category"
              name="category"
              defaultValue="Salad"
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
              <option value="Biryani">Biryani</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-200"
            >
              Product Price (₹)
            </label>

            <input
              onChange={onChangeHandler}
              value={data.price}
              className="admin-input"
              id="price"
              type="number"
              name="price"
              placeholder="e.g. 120"
            />
          </div>
        </div>

        <div className="border-t border-white/10 pt-5">
          <button
            type="submit"
            className="w-full rounded-lg bg-orange-600 px-8 py-3 font-semibold text-white shadow-lg shadow-orange-950/20 transition hover:bg-orange-500 sm:w-auto"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
