import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../config';
import logo from '../assets/logo.png';
import WorkerSidebar from '../Component/WorkerSidebar';
import WorkerStats from '../Component/WorkerStats';
import WorkerAnnouncements from '../Component/WorkerAnnouncements';


const WorkerDashboard = ({ setToken }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/announcement`, { timeout: 10000 });
      if (response.data.success) {
        setAnnouncements(response.data.announcements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-gray-600 dark:bg-gray-800 text-white z-10 relative md:hidden">
        <div className="flex items-center">
          <img src={logo} alt="ABABIO HOTEL & SUITE Logo" className='w-8 h-8' style={{ filter: 'brightness(0) invert(1)' }} />
          <h2 className='text-sm font-bold'>ABABIO HOTEL & SUITE</h2>
        </div>
        <button onClick={toggleSidebar} className="focus:outline-none md:hidden">
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isSidebarOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
            <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isSidebarOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
          </div>
        </button>
      </nav>

      <WorkerSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} setToken={setToken} />

      <div className="flex-1 min-h-screen bg-gray-100 p-2 md:ml-[256px]">
        <div className="max-w-5xl ml-0 mr-auto">
          <div className="bg-white rounded-lg shadow-md p-2 mb-2">
            <h1 className="text-lg font-bold text-gray-800">Worker Dashboard</h1>
          </div>

          <WorkerStats announcementsCount={announcements.length} />

          <WorkerAnnouncements />


        </div>
      </div>
    </>
  );
};

export default WorkerDashboard;
