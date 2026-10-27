import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets.js";
import { StoreContex } from "../contex/StoreContex.jsx";
import { AppContext } from "../contex/AppContext.jsx";
import { toast } from "react-toastify";
import axios from 'axios';

// Navbar component receives setShowLogin as a prop
const navbar = ({ setShowLogin }) => {

  const { userData, backendUrl, setuserData, setIsLoggedin } = useContext(AppContext);
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      data.success && setIsLoggedin(false)
      data.success && setuserData(false)
      navigate('/')
    } catch (error) {
      toast.error(error.message);
    }
  }

  const nameParts = userData?.name?.split(" ") || [];
  const firstLetter = nameParts[0]?.[0] || '';
  const lastLetter = nameParts[nameParts.length - 1]?.[0] || '';
  const initials = (firstLetter + lastLetter).toUpperCase();
  // Track which menu item is currently active
  const [menu, setMenu] = useState("Home");
  const hideMenuRoutes = [
    "/cart",
    "/order",
    "/myorders"
  ];

  
  const location = useLocation();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const showMenu = !hideMenuRoutes.includes(location.pathname);

  
 
  useEffect(() => {
    if (!isHome) {
      setSearch("");
      setShowSearch(false);
    }
  }, [isHome]);

  const { search, setSearch } = useContext(StoreContex);
  const [showSearch, setShowSearch] = useState(false);


  const navigate = useNavigate();

  // Function to scroll smoothly to a section and update active menu
  const scrollToSection = (sectionId, menuName) => {
    setMenu(menuName);

    if (sectionId === "home") {
      // Scroll to top if "Home" is clicked
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Scroll to specific section by ID
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
    navigate("/");
    setTimeout(() => {
      document.getElementById("food-display")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const closeSearch = () => {
    setSearch("");
    setShowSearch(false);
  };

  // Access cart-related context values
  const { getTotalCartAmount } = useContext(StoreContex);

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#111111]/95 px-[5%] py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">

        {/* Logo that scrolls to Home when clicked */}
        <Link to="/" onClick={() => scrollToSection("home", "Home")}>
          <img
            className="w-[100px] object-contain sm:w-[140px]"
            src={assets.logo}
            alt="Logo"
          />
        </Link>

        {/* Navigation menu items */}
        <ul className="flex items-center gap-3 text-xs text-gray-200 sm:gap-8 sm:text-base">

          <li
            onClick={() => scrollToSection("home", "Home")}
            className={` active:scale-95 cursor-pointer rounded-xl p-2 transition-all duration-300 ease-in-out hover:scale-100  hover:text-white ${menu === "Home" ? "border-orange-500 border-b-2 text-white" : "text-orange-400"
              }`}
          >
            <Link to="/">Home</Link>
          </li>

          {showMenu && (
            <li
              onClick={() => scrollToSection("menu", "Menu")}
              className={`active:scale-95 cursor-pointer rounded-xl p-2 transition-all duration-300 ease-in-out hover:scale-100  hover:text-white ${menu === "Menu" ? "border-b-2 border-orange-500 text-white" : "text-orange-400"
                }`}
            >
              Menu
            </li>
          )}

          <li
            onClick={() => scrollToSection("contact", "Contact us")}
            className={` active:scale-95 cursor-pointer rounded-xl p-2 transition-all duration-300 ease-in-out  hover:scale-100  hover:text-white ${menu === "Contact us" ? "border-orange-500 border-b-2 text-white" : "text-orange-400"
              }`}
          >
            Contact us
          </li>
        </ul>

        {/* Right-side icons and Sign-in button */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-5 lg:gap-6">
          {isHome && (
            showSearch ? (
              <div className="flex items-center rounded-full border border-white/10 bg-[#1c1c1c] px-2.5 py-2 transition-colors focus-within:border-orange-500/60 sm:px-3">
                <input
                  autoFocus
                  value={search}
                  onChange={onSearchChange}
                  placeholder="Search food..."
                  className="w-20 bg-transparent text-xs text-white outline-none placeholder:text-gray-500 sm:w-32 sm:text-sm lg:w-48"
                />

                <button
                  onClick={closeSearch}
                  className="ml-1 text-sm text-gray-400 transition-colors hover:text-orange-500 sm:ml-2"
                  aria-label="Close search"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="rounded-full p-1 transition-colors duration-200 hover:bg-white/5"
                aria-label="Open search"
              >
                {/* Search icon (hidden on small screens) */}
                <img
                  className="w-4 cursor-pointer sm:w-5"
                  src={assets.search_icon}
                  alt="Search"
                />
              </button>
            )
          )}

          {/* Cart icon with badge if items exist */}
          <Link to="/cart" className="relative">
            <img className="w-6" src={assets.basket_icon} alt="Basket" />

            {getTotalCartAmount() > 0 && (
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#111111] bg-orange-500" />
            )}
          </Link>

          {/* Sign-in button triggers login popup */}
          {!userData ? (
            <button
              onClick={() => setShowLogin(true)}
              className="rounded-full border border-orange-500 px-3 py-2 text-xs text-white transition hover:bg-orange-600 sm:px-6 sm:text-sm"
            >
              Sign in
            </button>
          ) : (
            <div className="group relative cursor-pointer border-2 border-orange-500 shadow-lg rounded-full p-2">

              {initials}

              <ul className="absolute right-0 top-full z-50 hidden min-w-40 flex-col gap-3 rounded-xl border border-white/10 bg-[#1c1c1c] p-3 text-sm text-gray-300 shadow-xl shadow-black/30 group-hover:flex">
                <li
                  onClick={() => navigate("/myorders")}
                  className="flex items-center gap-2 whitespace-nowrap transition-colors duration-200 hover:text-orange-500"
                >
                  <img className="w-5" src={assets.bag_icon} alt="" />
                  <p>Orders</p>
                </li>

                <hr className="border-white/10" />

                <li
                  onClick={logout}
                  className="flex items-center gap-2 whitespace-nowrap transition-colors duration-200 hover:text-orange-500"
                >
                  <img className="w-5" src={assets.logout_icon} alt="" />
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default navbar;
