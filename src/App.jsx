import React, { useState, useEffect } from 'react'
import Navbar from './Component/Navbar'
import AdminSidebar from './Component/AdminSidebar'
import {Routes,Route} from "react-router-dom"
import Home from "./Pages/Home"
import HotelDetails from "./Pages/HotelDetails"
import Footer from "./Component/Footer"
import RoomProvider from './context/RoomContext'
import AddHotel from './Pages/AddHotel';
import ListHotel from './Pages/ListHotel';
import Reservation from './Pages/Reservation'
import CreateAnnouncements from './Pages/CreateAnnouncements';
import WorkerLogin from './Pages/WorkerLogin';
import WorkerDashboard from './Pages/WorkerDashboard';
import WorkerPersonalDetails from './Pages/WorkerPersonalDetails';
import AdminWorkerDetails from './Pages/AdminWorkerDetails';
import Attendance from './Pages/Attendance';
import Workers from './Pages/Workers';
import ProtectedRoute from './Component/ProtectedRoute';

export const backendUrl="https://hotel-and-suit-backend.onrender.com"
function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [workerToken, setWorkerToken] = useState(localStorage.getItem('worker-token') || '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedWorkerToken = localStorage.getItem('worker-token');
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedWorkerToken) {
      setWorkerToken(storedWorkerToken);
    }
  }, []);

  return (
    <RoomProvider>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white relative">
        {token ? (
          <>
            <Navbar token={token} setToken={setToken} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <AdminSidebar setToken={setToken} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="md:ml-[318px]">
              <Routes>
              <Route path="/" element={<AddHotel  token={token}/>} />
              <Route path="/add" element={<AddHotel />} />
              <Route path="/list" element={<ListHotel />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/announcements" element={<CreateAnnouncements />} />
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute token={token}>
                    <Attendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workers"
                element={
                  <ProtectedRoute token={token}>
                    <Workers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/worker-details"
                element={
                  <ProtectedRoute token={token}>
                    <AdminWorkerDetails setToken={setToken} />
                  </ProtectedRoute>
                }
              />
              </Routes>
            </div>
          </>
        ) : workerToken ? (
          <Routes>
            <Route path="/worker/dashboard" element={<WorkerDashboard setToken={setWorkerToken} />} />
            <Route path="/worker/personal-details" element={<WorkerPersonalDetails setToken={setWorkerToken} />} />
            <Route path="/worker/announcements" element={<WorkerDashboard setToken={setWorkerToken} />} />
            <Route path="/worker/attendance" element={<WorkerDashboard setToken={setWorkerToken} />} />
            <Route path="*" element={<WorkerDashboard setToken={setWorkerToken} />} />
          </Routes>
        ) : (
          <>
            <Navbar token={token} setToken={setToken} />
            <Routes>
              <Route path="/" element={<Home setToken={setToken} />} />
              <Route path="/room/:id" element={<HotelDetails />} />

              <Route path="/worker-login" element={<WorkerLogin setToken={setWorkerToken} />} />
            </Routes>
          </>
        )}
      </div>
    </RoomProvider>
  )
}

export default App
