import React, { useState, useEffect } from 'react';
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

// Add axios config
axios.defaults.timeout = 5000; // 5 seconds timeout
axios.defaults.retry = 3;
axios.defaults.retryDelay = 1000;

const ListHotel = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/hotel/list`);
      if (response.data.success) {
        setHotels(response.data.hotels);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      if (error.code === 'ERR_CONNECTION_REFUSED') {
        toast.error('Cannot connect to server. Please check if backend is running.');
      } else {
        toast.error('Error loading hotels. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeHotel = async (id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/hotel/remove`, { _id: id }, {
        headers: {
          'admin-token': localStorage.getItem('token')
        }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchHotels();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error removing hotel');
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <div className="pl-4 md:pl-4">
      <h1 className="text-lg font-bold mb-4">Hotel List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-1 px-2 border-b text-sm">Image</th>
              <th className="py-1 px-2 border-b text-sm">Name</th>
              <th className="py-1 px-2 border-b text-sm">Description</th>
              <th className="py-1 px-2 border-b text-sm">Price</th>
              <th className="py-1 px-2 border-b text-sm">Date</th>
              <th className="py-1 px-2 border-b text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel._id} className="hover:bg-gray-50">
                <td className="py-1 px-2 border-b">
                  <img src={hotel.image} alt={hotel.name} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="py-1 px-2 border-b text-sm">{hotel.name}</td>
                <td className="py-1 px-2 border-b text-sm">{hotel.description}</td>
                <td className="py-1 px-2 border-b text-sm">${hotel.price}</td>
                <td className="py-1 px-2 border-b text-sm">{new Date(hotel.date).toLocaleDateString()}</td>
                <td className="py-1 px-2 border-b">
                  <button
                    onClick={() => removeHotel(hotel._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListHotel;
