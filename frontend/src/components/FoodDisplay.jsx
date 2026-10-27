
import React, { useContext } from 'react'
import { StoreContex } from '../contex/StoreContex'
import FoodItems from './FoodItems'

const FoodDisplay = ({ category }) => {
  const { food_list, search , setSearch  } = useContext(StoreContex);

 const query = search.trim().toLowerCase();

 const filteredFood = food_list.filter((item) => {
    const matchesCategory = category === "All" || category === item.category;
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="food-display" className="mt-8 scroll-mt-24">
      <h2 className="text-2xl font-semibold text-white sm:text-3xl">
        {query
          ? `Results for "${search.trim()}"`
          : category === "All"
            ? "Top Dishes Near You"
            : `${category} Dishes`}
      </h2>

      {filteredFood.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFood.map((item) => (
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
      ) : (
        <div className="mt-8 text-gray-400">
          <p>
            No food items found
            {query ? ` for "${search.trim()}"` : " in this category"}.
          </p>
          {query && (
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-sm text-orange-500 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;

