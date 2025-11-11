import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from './Home';
import { toast } from 'react-toastify';
import { Country, State, City } from 'country-state-city';
import { getStates, getLGAs } from '../data/nigerianStatesLGA';
import { IoIosLogOut } from "react-icons/io";
import { MdDashboard, MdSchedule } from "react-icons/md";
import logo from '../assets/logo.png';
import ThemeToggle from '../Component/ThemeToggle';

const WorkerPersonalDetails = ({ setToken }) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [profileData, setProfileData] = useState({
    email: localStorage.getItem('workerEmail') || '',
    name: localStorage.getItem('workerName') || '',
    dateOfBirth: '',
    position: '',
    status: '',
    country: '',
    stateOfOrigin: '',
    lgaOfOrigin: '',
    residentialAddress: '',
    phoneNumber: '',
    religion: ''
  });
  const [formData, setFormData] = useState({
    email: localStorage.getItem('workerEmail') || '',
    name: localStorage.getItem('workerName') || '',
    dateOfBirth: '',
    position: '',
    status: '',
    country: '',
    stateOfOrigin: '',
    lgaOfOrigin: '',
    residentialAddress: '',
    phoneNumber: '',
    religion: ''
  });
  const [customPosition, setCustomPosition] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [customReligion, setCustomReligion] = useState('');
  const [isCustomPosition, setIsCustomPosition] = useState(false);
  const [isCustomCountry, setIsCustomCountry] = useState(false);
  const [isCustomReligion, setIsCustomReligion] = useState(false);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableLGAs, setAvailableLGAs] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // preload countries list once
    const all = Country.getAllCountries() || [];
    setCountries(all.map(c => c.name));
    fetchProfile();

    // Listen for theme changes
    const handleThemeChange = (event) => {
      setIsDarkMode(event.detail.isDark);
    };
    window.addEventListener('themeChange', handleThemeChange);
    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/worker/get-profile`, {}, {
        headers: { 'worker-token': localStorage.getItem('worker-token') }
      });
      if (response.data.success) {
        const profile = response.data.profile || {};
        // Always populate email and name from login data for consistency
        const email = localStorage.getItem('workerEmail') || profile.email || '';
        const name = localStorage.getItem('workerName') || profile.name || '';
        const updatedProfile = { ...profile, email, name };
        setProfileData(updatedProfile);
        setFormData(updatedProfile);

        if (updatedProfile.country === 'Nigeria') {
          setAvailableStates(getStates());
          if (updatedProfile.stateOfOrigin) {
            setAvailableLGAs(getLGAs(updatedProfile.stateOfOrigin));
          }
        } else if (updatedProfile.country) {
          const selectedCountry = Country.getAllCountries().find(c => c.name === updatedProfile.country);
          if (selectedCountry) {
            const states = State.getStatesOfCountry(selectedCountry.isoCode) || [];
            setAvailableStates(states.map(s => s.name));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'country') {
      if (value === 'Nigeria') {
        setIsCustomCountry(false);
        setFormData(prev => ({ ...prev, country: value, stateOfOrigin: '', lgaOfOrigin: '' }));
        setAvailableStates(getStates());
        setAvailableLGAs([]);
      } else if (value === 'Other') {
        setIsCustomCountry(true);
        setFormData(prev => ({ ...prev, country: '', stateOfOrigin: '', lgaOfOrigin: '' }));
        setAvailableStates([]);
        setAvailableLGAs([]);
      } else {
        setIsCustomCountry(false);
        const selectedCountry = Country.getAllCountries().find(c => c.name === value);
        setFormData(prev => ({ ...prev, country: value, stateOfOrigin: '', lgaOfOrigin: '' }));
        if (selectedCountry) {
          const states = State.getStatesOfCountry(selectedCountry.isoCode) || [];
          setAvailableStates(states.map(s => s.name));
        }
        setAvailableLGAs([]);
      }
    } else if (name === 'stateOfOrigin') {
      setFormData(prev => ({ ...prev, stateOfOrigin: value, lgaOfOrigin: '' }));
      
      if (formData.country === 'Nigeria') {
        setAvailableLGAs(getLGAs(value) || []);
      } else {
        const selectedCountry = Country.getAllCountries().find(c => c.name === formData.country);
        if (selectedCountry) {
          const states = State.getStatesOfCountry(selectedCountry.isoCode);
          const selectedState = states.find(s => s.name === value);
          if (selectedState) {
            const cities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode) || [];
            setAvailableLGAs(cities.map(c => c.name));
          }
        }
      }
    } else if (name === 'religion') {
      if (value === 'Other') {
        setIsCustomReligion(true);
        setFormData({ ...formData, [name]: '' });
      } else {
        setIsCustomReligion(false);
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/worker/update-profile`, formData, {
        headers: { 'worker-token': localStorage.getItem('worker-token') }
      });
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        fetchProfile(); // Refetch the profile to display updated data
        // Reset form data to empty except email
        setFormData({
          email: formData.email,
          name: '',
          dateOfBirth: '',
          position: '',
          status: '',
          country: '',
          stateOfOrigin: '',
          lgaOfOrigin: '',
          residentialAddress: '',
          phoneNumber: '',
          religion: ''
        });
        // Reset custom input states
        setCustomPosition('');
        setCustomCountry('');
        setCustomReligion('');
        setIsCustomPosition(false);
        setIsCustomCountry(false);
        setIsCustomReligion(false);
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile');
    }
  };

  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-gray-600 dark:bg-gray-800 text-white z-10 relative md:hidden">
        <div className="flex items-center">
          <img src={logo} alt="ABABIO HOTEL & SUITE Logo" className='w-12 h-12' style={{ filter: 'brightness(0) invert(1)' }} />
          <h2 className='text-20 font-bold'>ABABIO HOTEL & SUITE</h2>
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
      <div className={`fixed top-0 md:left-0 right-0 h-full w-64 bg-purple-600 dark:bg-gray-700 transform ${isSidebarOpen ? 'translate-x-0' : 'md:translate-x-0 translate-x-full'} transition-transform duration-300 ease-in-out z-20`}>
        <div className="p-4">
          <div className="flex items-center mb-4">
            <img src={logo} alt="ABABIO HOTEL & SUITE Logo" className='w-12 h-12 mr-2' style={{ filter: 'brightness(0) invert(1)' }} />
            <h2 className='text-lg font-bold text-white'>ABABIO HOTEL & SUITE</h2>
          </div>
          <div className="flex justify-between items-center mb-4">
            <button onClick={toggleSidebar} className="focus:outline-none text-white md:hidden">
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

      <div className="flex-1 min-h-screen bg-gray-100 dark:bg-gray-900 p-2 md:ml-[200px]">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center md:text-left">Personal Details</h1>
              <button
                onClick={() => {
                  if (!showForm) {
                    // Opening the form, reset formData to empty except email
                    setFormData({
                      email: profileData.email,
                      name: '',
                      dateOfBirth: '',
                      position: '',
                      status: '',
                      country: '',
                      stateOfOrigin: '',
                      lgaOfOrigin: '',
                      residentialAddress: '',
                      phoneNumber: '',
                      religion: ''
                    });
                    setCustomPosition('');
                    setCustomCountry('');
                    setCustomReligion('');
                    setIsCustomPosition(false);
                    setIsCustomCountry(false);
                    setIsCustomReligion(false);
                  }
                  setShowForm(!showForm);
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {showForm ? 'Show Details' : 'Edit Details'}
              </button>
            </div>
            {!showForm ? (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{profileData.name || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Email</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{profileData.email || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{profileData.dateOfBirth || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Position</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{profileData.position || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Status</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{profileData.status || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Country</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{profileData.country || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">State of Origin</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{profileData.stateOfOrigin || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">LGA of Origin</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{profileData.lgaOfOrigin || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Residential Address</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{profileData.residentialAddress || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{profileData.phoneNumber || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Religion</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{profileData.religion || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        className="w-full md:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-black dark:text-white bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full md:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                        required
                      />
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full md:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                        <select
                          name="position"
                          value={formData.position === customPosition ? 'Other' : formData.position}
                          onChange={handleChange}
                          className="w-full md:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                          required
                        >
                          <option value="">Select Position</option>
                          <option value="Manager">Manager</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Staff">Staff</option>
                          <option value="Intern">Intern</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      {isCustomPosition ? (
                        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 md:ml-[33.33%]">
                          <input
                            type="text"
                            placeholder="Specify your position"
                            value={customPosition}
                            onChange={(e) => {
                              setCustomPosition(e.target.value);
                              setFormData({ ...formData, position: e.target.value });
                            }}
                            className="w-full md:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                            required
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full md:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                        <select
                          name="country"
                          value={formData.country === customCountry ? 'Other' : formData.country}
                          onChange={handleChange}
                          className="w-full md:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                          required
                        >
                          <option value="">Select Country</option>
                          {countries.map(cn => (
                            <option key={cn} value={cn}>{cn}</option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      {isCustomCountry ? (
                        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 md:ml-[33.33%]">
                          <input
                            type="text"
                            placeholder="Specify your country"
                            value={customCountry}
                            onChange={(e) => {
                              setCustomCountry(e.target.value);
                              setFormData({ ...formData, country: e.target.value });
                            }}
                            className="w-full md:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                            required
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">State of Origin</label>
                      <select
                        name="stateOfOrigin"
                        value={formData.stateOfOrigin}
                        onChange={handleChange}
                        className="w-full md:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                        required
                        disabled={!formData.country}
                      >
                        <option value="">Select State</option>
                        {availableStates.map(state => (
      <option key={state} value={state}>{state}</option>
    ))}
                      </select>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">LGA of Origin</label>
                      <select
                        name="lgaOfOrigin"
                        value={formData.lgaOfOrigin}
                        onChange={handleChange}
                        className="w-full md:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                        required
                        disabled={!formData.stateOfOrigin}
                      >
                        <option value="">Select LGA</option>
                        {availableLGAs.map(lga => (
      <option key={lga} value={lga}>{lga}</option>
    ))}
                      </select>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Residential Address</label>
                      <input
                        type="text"
                        name="residentialAddress"
                        value={formData.residentialAddress}
                        onChange={handleChange}
                        className="w-full md:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                        required
                      />
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full md:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Religion</label>
                        <select
                          name="religion"
                          value={formData.religion === customReligion ? 'Other' : formData.religion}
                          onChange={handleChange}
                          className="w-full md:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                          required
                        >
                          <option value="">Select Religion</option>
                          <option value="Christianity">Christianity</option>
                          <option value="Islam">Islam</option>
                        </select>
                      </div>
                      {isCustomReligion ? (
                        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 md:ml-[33.33%]">
                          <input
                            type="text"
                            placeholder="Specify your religion"
                            value={customReligion}
                            onChange={(e) => {
                              setCustomReligion(e.target.value);
                              setFormData({ ...formData, religion: e.target.value });
                            }}
                            className="w-full md:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                            required
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      onClick={() => navigate('/worker/dashboard')}
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkerPersonalDetails;
