
import React, { useState } from 'react'
import Navbar from './components/navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Footer from './components/Footer'
import LoginPopup from './components/LoginPopup'
import 'react-toastify/dist/ReactToastify.css'; 
import { ToastContainer } from 'react-toastify'
import ResetPassword from './pages/ResetPassword'
import MyOrders from './pages/MyOrders'
import AiChat from './components/AiChat'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <ToastContainer 
      position='top-center'
      hideProgressBar={false}
      autoClose={3000} 
      closeOnClick
      theme="colored"/>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}

      <div className="min-h-screen bg-[#111111] text-[#f5f5f5]">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path='/pass-reset' element={<ResetPassword setShowLogin={setShowLogin}/>} />
        </Routes>
      </div>

      <Footer />
      <AiChat />
    </>
  )
}

export default App
