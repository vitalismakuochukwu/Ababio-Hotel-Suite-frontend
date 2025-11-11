import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoIosLogOut } from "react-icons/io"
import { MdDashboard, MdSchedule } from "react-icons/md"
import { FaBullhorn } from "react-icons/fa"
import logo from '../assets/logo.png'

const WorkerSidebar = ({ setToken }) => {
  return (
    <div className="h-full w-64 bg-purple-600">
      <div className="p-4">
        <div className='mt-4 px-6 flex items-center gap-4'>
          <img src={logo} alt="ABABIO HOTEL & SUITE Logo" className='w-12 h-12' style={{ filter: 'brightness(0) invert(1)' }} />
          <h2 className='text-20 font-bold'>ABABIO HOTEL $ SUITE</h2>
        </div>
        <div className='flex flex-col gap-4 pt-6'>
          <NavLink to='/worker/dashboard' className="flex items-center gap-3 px-4 py-3 border-b-2 border-gray-200 text-white hover:bg-purple-700">
            <MdDashboard className='text-[35px] text-white' />
            <p className='text-base'>Dashboard</p>
          </NavLink>
          <NavLink to='/worker/personal-details' className="flex items-center gap-3 px-4 py-3 border-b-2 border-gray-200 text-white hover:bg-purple-700">
            <MdDashboard className='text-[35px] text-white' />
            <p className='text-base whitespace-nowrap'>Personal Details</p>
          </NavLink>
          <NavLink to='/worker/attendance' className="flex items-center gap-3 px-4 py-3 border-b-2 border-gray-200 text-white hover:bg-purple-700">
            <MdSchedule className='text-[35px] text-white' />
            <p className='text-base'>Attendance Form</p>
          </NavLink>
          <button onClick={() => { setToken(''); localStorage.removeItem('token'); localStorage.removeItem('worker-token'); window.location.href = '/'; }} className='flex items-center gap-3 px-6 py-3 border-b-2 border-gray-200 text-white w-full text-left hover:bg-purple-700'>
            <IoIosLogOut className='text-[35px] text-white' />
            <p className='text-base'>Logout</p>
          </button>
        </div>
        <div className='mt-8 px-6'>

        </div>
      </div>
    </div>
  )
}

export default WorkerSidebar
