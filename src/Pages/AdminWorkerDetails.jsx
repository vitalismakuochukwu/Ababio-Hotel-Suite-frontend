import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const AdminWorkerDetails = ({ setToken }) => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async (workerId) => {
    if (!window.confirm('Are you sure you want to delete this worker?')) {
      return;
    }

    try {
      const response = await axios.delete(`${backendUrl}/api/admin/workers/${workerId}`, {
        headers: {
          'admin-token': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setWorkers(workers.filter(worker => worker._id !== workerId));
        toast.success('Worker deleted successfully');
      } else {
        toast.error(response.data.message || 'Failed to delete worker');
      }
    } catch (error) {
      console.error('Error deleting worker:', error);
      toast.error(error.response?.data?.message || 'Error deleting worker');
    }
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        console.log('Fetching workers...');
        const response = await axios.get(`${backendUrl}/api/admin/workers`, {
          headers: {
            'admin-token': localStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        });

        console.log('Response:', response.data);

        if (response.data.success) {
          setWorkers(response.data.workers);
          toast.success('Workers data loaded successfully');
        } else {
          setError(response.data.message || 'Failed to fetch worker data');
          toast.error(response.data.message || 'Failed to fetch worker data');
        }
      } catch (error) {
        console.error('Error details:', error.response || error);
        const errorMessage = error.response?.data?.message || error.message || 'Error connecting to server';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    

    fetchWorkers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-md p-6 min-h-[600px] max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Worker Details</h1>
        {workers.length > 0 ? (
          <div className="overflow-auto">
            <table className="min-w-full divide-x divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone Number</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workers.map((worker) => (
                  <tr key={worker._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">{worker.name || worker.Name || 'N/A'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{worker.email || worker.Email}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{worker.position || worker.Position || 'N/A'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{worker.status || 'N/A'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{worker.phoneNumber || 'N/A'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(worker._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500">No workers found</div>
        )}
      </div>
    </div>
    
  );

};

export default AdminWorkerDetails;
