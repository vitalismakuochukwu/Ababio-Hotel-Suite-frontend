import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'
import ThemeToggle from './ThemeToggle'
import Login from './Login'
import { IoMdAddCircleOutline, IoIosLogOut } from "react-icons/io"
import { MdChecklistRtl, MdFormatListBulletedAdd } from "react-icons/md"
import { FaBullhorn } from "react-icons/fa"

const Navbar = ({token, setToken}) => {
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handleThemeChange = (e) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (token) {
    return (
      <>
        <nav className={`flex items-center justify-between p-4 ${isDark ? 'bg-black/80 text-white' : 'bg-white/80 text-black'} backdrop-blur-sm z-10 relative`}>
          <div className="flex items-center">
            <img src={logo} alt="Logo" className='w-8 h-8 mr-2' style={{ filter: isDark ? 'brightness(0) invert(1)' : 'none' }} />
            <h2 className='text-sm font-bold'>ABABIO HOTEL & SUITE</h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => { setToken(''); localStorage.removeItem('token'); window.location.href = '/'; }} className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition md:hidden'>
              <IoIosLogOut className='text-[20px]' />
            </button>
            <button onClick={toggleSidebar} className="focus:outline-none md:hidden">
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isSidebarOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isSidebarOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>
        </nav>

        {/* Admin Sidebar */}
        <div className={`fixed top-0 right-0 h-full w-64 bg-purple-600 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-20`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <button onClick={toggleSidebar} className="focus:outline-none text-white">
                <span className="text-2xl">&times;</span>
              </button>
              <ThemeToggle />
            </div>
            <div className='flex flex-col gap-4 pt-6'>
              <NavLink to='/add' className="flex items-center gap-3 px-4 py-3 border-b-2 border-gray-200 text-white hover:bg-purple-700" onClick={toggleSidebar}>
                <IoMdAddCircleOutline className='text-[35px] text-white' />
                <p className='text-sm'>Add Rooms</p>
              </NavLink>
              <NavLink to='/list' className="flex items-center gap-3 px-4 py-3 border-b-2 border-gray-200 text-white hover:bg-purple-700" onClick={toggleSidebar}>
                <MdFormatListBulletedAdd className='text-[35px] text-white' />
                <p className='text-sm'>Room list</p>
              </NavLink>
              <NavLink to='/reservation' className="flex items-center gap-3 px-4 py-1 border-b-2 border-gray-200 text-white hover:bg-purple-700" onClick={toggleSidebar}>
                <MdChecklistRtl className='text-[35px] text-white' />
                <p className='text-sm'>Reservations</p>
              </NavLink>
              <NavLink to='/announcements' className="flex items-center gap-3 px-4 py-3 border-b-2 border-gray-200 text-white hover:bg-purple-700" onClick={toggleSidebar}>
                <FaBullhorn className='text-[35px] text-white' />
                <p className='text-sm'>Create Announcements</p>
              </NavLink>
              <NavLink to='/attendance' className="flex items-center gap-3 px-4 py-3 border-b-2 border-gray-200 text-white hover:bg-purple-700" onClick={toggleSidebar}>
                <IoMdAddCircleOutline className='text-[35px] text-white' />
                <p className='text-sm'>Attendance</p>
              </NavLink>
              <NavLink to='/workers' className="flex items-center gap-3 px-4 py-3 border-b-2 border-gray-200 text-white hover:bg-purple-700" onClick={toggleSidebar}>
                <MdFormatListBulletedAdd className='text-[35px] text-white' />
                <p className='text-sm'>Workers</p>
              </NavLink>
              <Link
                to="/admin/worker-details"
                className="flex items-center gap-3 px-4 py-3 border-b-2 border-gray-200 text-white hover:bg-purple-700"
                onClick={toggleSidebar}
              >
                <IoMdAddCircleOutline className='text-[35px] text-white' />
                <p className='text-sm'>Worker Details</p>
              </Link>
              <button onClick={() => { setToken(''); localStorage.removeItem('token'); window.location.href = '/'; }} className='flex items-center gap-3 px-6 py-3 border-b-2 border-gray-200 text-white w-full text-left hover:bg-purple-700'>
                <IoIosLogOut className='text-[35px] text-white' />
                <p className='text-sm'>Logout</p>
              </button>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isSidebarOpen && (
          <div onClick={toggleSidebar} className="fixed inset-0 bg-transparent z-10"></div>
        )}
      </>
    );
  }

  return (
    <>
      <nav className={`flex items-center justify-between p-4 ${isDark ? 'bg-black/80 text-white' : 'bg-white/80 text-black'} backdrop-blur-sm z-10 relative`}>

        <Link to="/">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
          <h2 className='font-medium text-lg whitespace-nowrap'>ABABIO <span className='text-purple-500'>HOTEL & SUITE</span></h2>

        </div>
        </Link>
        <div className="flex-1 text-center hidden md:block">
          <ul className='flex justify-center gap-8'>
            <li className='font-bold text-lg cursor-pointer hover:text-purple-500' onClick={() => document.getElementById('hero').scrollIntoView({ behavior: 'smooth' })}>Home</li>
            <li className='font-bold text-lg cursor-pointer hover:text-purple-500' onClick={() => document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' })}>Rooms</li>
              <li className='font-bold text-lg cursor-pointer hover:text-purple-200' onClick={() => { document.getElementById('services').scrollIntoView({ behavior: 'smooth' }); toggleSidebar(); }}>Services</li>
            <li className='font-bold text-lg cursor-pointer hover:text-purple-500' onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Contact</li>

          </ul>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition hidden md:block"
          >
            Admin Login
          </button>
          <button onClick={toggleSidebar} className="md:hidden focus:outline-none">
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isSidebarOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
              <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isSidebarOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
            </div>
          </button>
        </div>

      </nav>

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-purple-600 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-20 md:hidden`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <button onClick={toggleSidebar} className="focus:outline-none text-white">
              <span className="text-2xl">&times;</span>
            </button>
            <ThemeToggle />
          </div>
          <ul className='flex flex-col gap-4 text-white'>
            <li className='font-bold text-lg cursor-pointer hover:text-purple-200' onClick={() => { document.getElementById('hero').scrollIntoView({ behavior: 'smooth' }); toggleSidebar(); }}>Home</li>
            <li className='font-bold text-lg cursor-pointer hover:text-purple-200' onClick={() => { document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' }); toggleSidebar(); }}>Rooms</li>
            <li className='font-bold text-lg cursor-pointer hover:text-purple-200' onClick={() => { document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); toggleSidebar(); }}>Contact</li>
              <li className='font-bold text-lg cursor-pointer hover:text-purple-200' onClick={() => { document.getElementById('services').scrollIntoView({ behavior: 'smooth' }); toggleSidebar(); }}>Services</li>
            <li>
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition"
                title="Admin Login"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div onClick={toggleSidebar} className="fixed inset-0 bg-transparent z-10 md:hidden"></div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <Login setToken={setToken} onClose={() => setShowLoginModal(false)} />
        </div>
      )}
    </>
  )
}

export default Navbar
