import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { IoMdAddCircleOutline, IoIosLogOut } from "react-icons/io"
import { MdChecklistRtl, MdFormatListBulletedAdd } from "react-icons/md"
import { FaBullhorn, FaUsers, FaCalendarCheck } from "react-icons/fa"
import logo from '../assets/logo.png'

const AdminSidebar = ({ setToken, isOpen, onClose }) => {
  return (
    <div className={`fixed top-0 left-0 h-full w-72 bg-purple-600 transform transition-transform duration-300 ease-in-out z-20 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onClose} className="focus:outline-none text-white md:hidden">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className='mt-4 px-6 flex items-center gap-4'>
          <img src={logo} alt="ABABIO HOTEL & SUITE Logo" className='w-8 h-8' style={{ filter: 'brightness(0) invert(1)' }} />
          <h2 className='text-sm font-bold whitespace-nowrap'>ABABIO HOTEL $ SUITE</h2>
        </div>
        <div className='flex flex-col gap-4 pt-6'>
          <NavLink to='/add' className="flex items-center gap-3 px-4 py-1 border-b-2 border-gray-200 text-white hover:bg-purple-700" onClick={onClose}>
            <IoMdAddCircleOutline className='text-[25px] text-white' />
            <p className='text-sm whitespace-nowrap'>Add Rooms</p>
          </NavLink>
          <NavLink to='/list' className="flex items-center gap-3 px-4 py-2 border-b-2 border-gray-200 text-white hover:bg-purple-700" onClick={onClose}>
            <MdFormatListBulletedAdd className='text-[25px] text-white' />
            <p className='text-sm whitespace-nowrap'>Room list</p>
          </NavLink>
          <NavLink to='/reservation' className="flex items-center gap-3 px-4 py-2 border-b-2 border-gray-200 text-white hover:bg-purple-700" onClick={onClose}>
            <MdChecklistRtl className='text-[25px] text-white' />
            <p className='text-sm whitespace-nowrap'>Reservations</p>
          </NavLink>
          <NavLink to='/announcements' className="flex items-center gap-3 px-4 py-2 border-b-2 border-gray-200 text-white hover:bg-purple-700" onClick={onClose}>
            <FaBullhorn className='text-[25px] text-white' />
            <p className='text-sm whitespace-nowrap'>Create Announcements</p>
          </NavLink>
          <NavLink to='/attendance' className="flex items-center gap-3 px-4 py-2 border-b-2 border-gray-200 text-white hover:bg-purple-700" onClick={onClose}>
            <FaCalendarCheck className='text-[25px] text-white' />
            <p className='text-sm whitespace-nowrap'>Attendance</p>
          </NavLink>
          <NavLink to='/workers' className="flex items-center gap-3 px-4 py-2 border-b-2 border-gray-200 text-white hover:bg-purple-700" onClick={onClose}>
            <FaUsers className='text-[25px] text-white' />
            <p className='text-sm whitespace-nowrap'>Workers</p>
          </NavLink>
          <Link
            to="/admin/worker-details"
            className="flex items-center gap-3 px-4 py-2 border-b-2 border-gray-200 text-white hover:bg-purple-700"
            onClick={onClose}
          >
            <IoMdAddCircleOutline className='text-[25px] text-white' />
            <p className='text-sm whitespace-nowrap'>Worker Details</p>
          </Link>
          <button onClick={() => { setToken(''); localStorage.removeItem('token'); window.location.href = '/'; }} className='flex items-center gap-3 px-6 py-2 border-b-2 border-gray-200 text-white w-full text-left hover:bg-purple-700'>
            <IoIosLogOut className='text-[25px] text-white' />
            <p className='text-sm whitespace-nowrap'>Logout</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar
