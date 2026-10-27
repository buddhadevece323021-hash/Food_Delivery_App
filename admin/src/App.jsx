
import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import {ToastContainer} from 'react-toastify'

const App = () => {

  const url = "http://localhost:3001";

  return (
    <div className="min-h-screen bg-[#111111] text-gray-100">
      <ToastContainer/>
      <Navbar />

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
