import React, { useState, useEffect } from 'react';
import { backendUrl } from '../config';
import axios from 'axios';
import { toast } from 'react-toastify';

const Reservation = () => {
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/reservation/getall`);
      if (response.data) {
        setReservations(response.data);
      } else {
        toast.error('Error fetching reservations');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching reservations');
    }
  };

  const deleteReservation = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/reservation/delete/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchReservations();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting reservation');
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="bg-purple-400  pl-4 md:pl-4">
      <h1 className="text-lg font-bold mb-1">Reservations</h1>
      <div className=" overflow-x-auto">
        <table className="bg-purple min-w-full  border border-gray-300">
          <thead>
            <tr>
              <th className="py-1 px-2 border-b text-sm">Name</th>
              <th className="py-1 px-2 border-b text-sm">Email</th>
              <th className="py-1 px-2 border-b text-sm">Phone</th>
              <th className="py-1 px-2 border-b text-sm">Check-in</th>
              <th className="py-1 px-2 border-b text-sm">Check-out</th>
              <th className="py-1 px-2 border-b text-sm">Guests</th>
              <th className="py-1 px-2 border-b text-sm">Room</th>
              <th className="py-1 px-2 border-b text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td className="py-1 px-2 border-b text-sm">{reservation.name}</td>
                <td className="py-1 px-2 border-b text-sm">{reservation.email}</td>
                <td className="py-1 px-2 border-b text-sm">{reservation.phone}</td>
                <td className="py-1 px-2 border-b text-sm">{new Date(reservation.checkin).toLocaleDateString()}</td>
                <td className="py-1 px-2 border-b text-sm">{new Date(reservation.checkout).toLocaleDateString()}</td>
                <td className="py-1 px-2 border-b text-sm">{reservation.guests}</td>
                <td className="py-1 px-2 border-b text-sm">{reservation.roomName}</td>
                <td className="py-1 px-2 border-b">
                  <button
                    onClick={() => deleteReservation(reservation._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
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

export default Reservation;
