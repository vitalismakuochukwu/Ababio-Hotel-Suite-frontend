import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from './Home';
import { IoIosLogOut } from "react-icons/io";
import { MdDashboard, MdSchedule } from "react-icons/md";
import logo from '../assets/logo.png';

const WorkerDashboard = ({ setToken }) => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [workersCount, setWorkersCount] = useState(0);

  // Attendance state
  const [workerDetails, setWorkerDetails] = useState({ fullname: '', position: '' });
  const [attendance, setAttendance] = useState({
    signedIn: false,
    startTime: null,
    endTime: null,
    shift: '',
    location: null
  });
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('workerEmail');
    localStorage.removeItem('workerPassword');
    setToken('');
    navigate('/');
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/announcement`);
      if (response.data.success) {
        setAnnouncements(response.data.announcements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchWorkersCount = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/worker/count`);
      if (response.data.success) {
        setWorkersCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching workers count:', error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchWorkerDetails();
    fetchAttendance();
    fetchWorkersCount();
  }, []);

  // Fetch worker details
  const fetchWorkerDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/api/worker/profile`, {
        headers: { 'worker-token': token }
      });
      if (response.data.success) {
        setWorkerDetails({
          fullname: response.data.profile.name,
          position: response.data.profile.position
        });
      }
    } catch (error) {
      console.error('Error fetching worker details:', error);
    }
  };

  // Fetch attendance
  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${backendUrl}/api/worker/attendance`, {}, {
        headers: { 'worker-token': token }
      });
      if (response.data.success && response.data.attendance) {
        const att = response.data.attendance;
        setAttendance({
          signedIn: att.signedIn,
          startTime: att.startTime ? new Date(att.startTime) : null,
          endTime: att.endTime ? new Date(att.endTime) : null,
          shift: att.shift,
          location: att.location
        });
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  // Determine current shift
  const getCurrentShift = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 7 && hour < 18) {
      return 'morning';
    } else {
      return 'night';
    }
  };

  // Get geolocation
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  };

  // Handle sign in
  const handleSignIn = async () => {
    setLoading(true);
    try {
      const location = await getLocation();
      const shift = getCurrentShift();
      const token = localStorage.getItem('token');
      const response = await axios.post(`${backendUrl}/api/worker/signin`, {
        shift,
        location
      }, {
        headers: { 'worker-token': token }
      });
      if (response.data.success) {
        setAttendance({
          signedIn: true,
          startTime: new Date(),
          endTime: null,
          shift,
          location
        });
        alert('Signed in successfully');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Failed to sign in. Please check location permissions.');
    }
    setLoading(false);
  };

  // Handle sign out
  const handleSignOut = async () => {
    setLoading(true);
    try {
      const location = await getLocation();
      const token = localStorage.getItem('token');
      const response = await axios.post(`${backendUrl}/api/worker/signout`, {
        location
      }, {
        headers: { 'worker-token': token }
      });
      if (response.data.success) {
        setAttendance(prev => ({
          ...prev,
          signedIn: false,
          endTime: new Date(),
          location
        }));
        alert('Signed out successfully');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please check location permissions.');
    }
    setLoading(false);
  };

  // Filtered announcements based on search and filter
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          announcement.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || announcement.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(announcements.map(ann => ann.category).filter(cat => cat))];

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
      
            <button onClick={() => { setToken(''); localStorage.removeItem('token'); localStorage.removeItem('worker-token'); window.location.href = '/'; }} className='flex items-center gap-3 px-6 py-3 border-b-2 border-gray-200 text-white w-full text-left hover:bg-purple-700'>
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

      <div className="flex-1 min-h-screen bg-gray-100 p-2 md:ml-[256px]">
        <div className="max-w-5xl ml-0 mr-auto">
          <div className="bg-white rounded-lg shadow-md p-2 mb-2">
            <h1 className="text-lg font-bold text-gray-800">Worker Dashboard</h1>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-sm font-semibold text-gray-800 mb-2"> Staffs</h2>
              <div className="text-lg font-bold text-blue-600">{workersCount}</div>
              <p className="text-sm text-gray-600">Total</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">Completed</h2>
              <div className="text-lg font-bold text-green-600">12</div>
              <p className="text-sm text-gray-600">This week</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">Announcements</h2>
              <div className="text-lg font-bold text-purple-600">{announcements.length}</div>
              <p className="text-sm text-gray-600">New messages</p>
            </div>
          </div>

       
     
          {/* Announcements */}
          <div className="bg-white rounded-lg shadow-md p-4 mt-2">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Announcements</h2>

            {/* Search and Filter */}
            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {filteredAnnouncements.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">Title</th>
                      <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">Body</th>
                      <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">Category</th>
                      <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAnnouncements.map((announcement) => (
                      <tr key={announcement._id} className="border-b">
                        <td className="px-2 py-1 text-sm text-gray-900">{announcement.title}</td>
                        <td className="px-2 py-1 text-sm text-gray-600">{announcement.body}</td>
                        <td className="px-2 py-1 text-sm text-gray-600">{announcement.category}</td>
                        <td className="px-2 py-1 text-sm text-gray-600">{new Date(announcement.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No announcements available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkerDashboard;
