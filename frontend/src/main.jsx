import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import StoreContexProvider from './contex/StoreContex.jsx'
import { AppContextProvider } from './contex/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContexProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </StoreContexProvider>
  </BrowserRouter>
)
