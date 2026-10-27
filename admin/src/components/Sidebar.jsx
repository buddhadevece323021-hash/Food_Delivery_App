
import React from 'react'
import { assets } from '../assets/admin_assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const links = [
    { to: '/add', label: 'Add Items', icon: assets.add_icon },
    { to: '/list', label: 'List Items', icon: assets.order_icon },
    { to: '/orders', label: 'Orders', icon: assets.order_icon },
  ]

  return (
    <aside className="w-full shrink-0 border-b border-white/10 bg-[#161616] p-3 sm:w-[220px] sm:border-b-0 sm:border-r sm:p-4 lg:w-[250px] lg:p-6">
      <p className="mb-4 hidden px-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 sm:block">
        Management
      </p>

      <nav className="flex gap-2 sm:flex-col sm:gap-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border px-2 py-3 text-xs transition-all duration-200 sm:flex-none sm:justify-start sm:gap-3 sm:px-3 sm:text-sm ${
                isActive
                  ? 'border-orange-500/30 bg-orange-500/10 text-orange-400'
                  : 'border-transparent text-gray-400 hover:border-white/10 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <img
              className="h-5 w-5 shrink-0 object-contain"
              src={link.icon}
              alt=""
            />

            <span className="truncate">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
