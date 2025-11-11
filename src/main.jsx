import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import RoomContextProvider from './context/RoomContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RoomContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RoomContextProvider>
  </React.StrictMode>,
)
