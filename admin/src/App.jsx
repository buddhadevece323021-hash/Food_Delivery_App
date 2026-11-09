import React, { useState } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'

// If the server rejects the admin token, log out automatically
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      localStorage.getItem("adminToken") &&
      !error.config?.url?.includes("admin-login")
    ) {
      localStorage.removeItem("adminToken")
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

const App = () => {

  const url = import.meta.env.VITE_API_URL;
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "")

  // Every admin request now sends the token automatically
  if (token) {
    axios.defaults.headers.common["token"] = token
  } else {
    delete axios.defaults.headers.common["token"]
  }

  const logout = () => {
    localStorage.removeItem("adminToken")
    setToken("")
  }

  // Not logged in: show only the login page
  if (!token) {
    return (
      <>
        <ToastContainer />
        <Login url={url} setToken={setToken} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#111111] text-gray-100">
      <ToastContainer/>
      <Navbar onLogout={logout} />

      <div className="flex min-h-[calc(100vh-73px)]">
        <Sidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
          <Routes>
            <Route path="/" element={<Navigate to="/add" replace />} />
            <Route path="/add" element={<Add url={url} />} />
            <Route path="/list" element={<List url={url} />} />
            <Route path="/orders" element={<Orders url={url} />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App