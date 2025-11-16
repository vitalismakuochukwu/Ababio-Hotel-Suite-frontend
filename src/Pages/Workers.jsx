import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../config';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Gender: '',
    Position: '',
    Password: '',
    image: null,
    dateOfBirth: '',
    serialNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/worker/getall`, {
        headers: {
          'admin-token': localStorage.getItem('token')
        }
      });
      if (response.data.success) {
        setWorkers(response.data.workers);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching workers');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(`${backendUrl}/api/worker/register`, formDataToSend, {
        headers: {
          'admin-token': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 seconds timeout for image upload
      });

      if (response.data.success) {
        toast.success('Worker added successfully');
        setShowForm(false);
        setFormData({
          Name: '',
          Email: '',
          Gender: '',
          Position: '',
          Password: '',
          image: null,
          dateOfBirth: '',
          serialNumber: ''
        });
        fetchWorkers();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 409) {
        toast.error('Email already exists. Please use a different email.');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please try again.');
      } else {
        toast.error('Error adding worker. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, workerId) => {
    try {
      let endpoint = '';
      let data = {};

      switch (action) {
        case 'view':
          // Handle view action
          toast.info('View functionality to be implemented');
          return;
        case 'edit':
          // Handle edit action
          toast.info('Edit functionality to be implemented');
          return;
        case 'salary':
          const salary = prompt('Enter new salary:');
          if (salary) {
            endpoint = `/api/worker/salary/${workerId}`;
            data = { salary: parseFloat(salary) };
          }
          break;
        case 'leave':
          const confirmLeave = window.confirm('Mark worker as on leave?');
          if (confirmLeave) {
            endpoint = `/api/worker/leave/${workerId}`;
            data = { onLeave: true };
          }
          break;
        default:
          return;
      }

      if (endpoint) {
        const response = await axios.put(`${backendUrl}${endpoint}`, data, {
          headers: {
            'admin-token': localStorage.getItem('token')
          }
        });

        if (response.data.success) {
          toast.success(`${action} updated successfully`);
          fetchWorkers();
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(`Error updating ${action}`);
    }
  };

  const filteredWorkers = workers.filter(worker =>
    worker.Position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchWorkers();
  }, []);

  return (
    <div className="bg-purple-400 p-8">
      <h1 className="text-lg font-bold mb-6">Worker Management</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by Position"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-500 text-white px-6 py-1 rounded-md hover:bg-green-600 text-sm"
          >
            Add New Worker
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed  inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-400 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add New Worker</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="S/N"
                value={formData.serialNumber}
                onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={formData.Name}
                onChange={(e) => setFormData({...formData, Name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Position"
                value={formData.Position}
                onChange={(e) => setFormData({...formData, Position: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="date"
                placeholder="DOB"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.Email}
                onChange={(e) => setFormData({...formData, Email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <select
                value={formData.Gender}
                onChange={(e) => setFormData({...formData, Gender: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="password"
                placeholder="Password"
                value={formData.Password}
                onChange={(e) => setFormData({...formData, Password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? 'Adding...' : 'Add Worker'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                  className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="bg-purple-400 min-w-full  border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">S/N</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Position</th>
              <th className="py-2 px-4 border-b">DOB</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkers.map((worker, index) => (
              <tr key={worker._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-center">{worker.serialNumber || index + 1}</td>
                <td className="py-2 px-4 border-b">{worker.Name}</td>
                <td className="py-2 px-4 border-b">
                  {worker.image ? (
                    <img src={worker.image} alt={worker.Name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  )}
                </td>
                <td className="py-2 px-4 border-b">{worker.Position}</td>
                <td className="py-2 px-4 border-b">{worker.dateOfBirth ? new Date(worker.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction('view', worker._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleAction('edit', worker._id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleAction('salary', worker._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                    >
                      Salary
                    </button>
                    <button
                      onClick={() => handleAction('leave', worker._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Leave
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="text-center mt-4">
          <p>Loading workers data...</p>
        </div>
      )}
    </div>
  );
};

export default Workers;
