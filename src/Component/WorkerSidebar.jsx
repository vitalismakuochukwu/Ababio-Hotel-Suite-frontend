import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import logo from '../assets/logo.png';

const WorkerSidebar = ({ isSidebarOpen, toggleSidebar, setToken }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('worker-token');
    localStorage.removeItem('workerEmail');
    localStorage.removeItem('workerPassword');
    setToken('');
    window.location.href = '/';
  };

  return (
    <>
      {/* Worker Sidebar */}
      <div className={`fixed top-0 md:left-0 right-0 h-full w-64 bg-purple-600 transform ${isSidebarOpen ? 'translate-x-0' : 'md:translate-x-0 translate-x-full'} transition-transform duration-300 ease-in-out z-20`}>
        <div className="p-4">
          <div className="flex items-center mb-4">
            <img src={logo} alt="ABABIO HOTEL & SUITE Logo" className='w-8 h-8 mr-2' style={{ filter: 'brightness(0) invert(1)' }} />
            <h2 className='text-sm font-bold text-white'>ABABIO HOTEL & SUITE</h2>
          </div>
          <div className="flex justify-between items-center mb-4 md:hidden">
            <button onClick={toggleSidebar} className="focus:outline-none text-white">
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          <div className='flex flex-col gap-4 pt-6'>
            <NavLink to='/worker/dashboard' className="flex items-center gap-3 px-4 py-3 border-b-2 border-gray-200 text-white hover:bg-purple-700" onClick={toggleSidebar}>
              <MdDashboard className='text-[35px] text-white' />
              <p className='text-base'>Dashboard</p>
            </NavLink>
            <NavLink to='/worker/personal-details' className="flex items-center gap-3 px-4 py-3 border-b-2 border-gray-200 text-white hover:bg-purple-700" onClick={toggleSidebar}>
              <MdDashboard className='text-[35px] text-white' />
              <p className='text-base whitespace-nowrap'>Personal Details</p>
            </NavLink>

            <button onClick={handleLogout} className='flex items-center gap-3 px-6 py-3 border-b-2 border-gray-200 text-white w-full text-left hover:bg-purple-700'>
              <IoIosLogOut className='text-[35px] text-white' />
              <p className='text-base'>Logout</p>
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
};

export default WorkerSidebar;
