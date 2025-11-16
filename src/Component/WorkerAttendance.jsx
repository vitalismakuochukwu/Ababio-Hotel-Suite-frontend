import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../config';

const WorkerAttendance = () => {
  const [workerDetails, setWorkerDetails] = useState({ fullname: '', position: '' });
  const [attendance, setAttendance] = useState({
    signedIn: false,
    startTime: null,
    endTime: null,
    shift: '',
    location: null
  });
  const [loading, setLoading] = useState(false);

  // Fetch worker details
  const fetchWorkerDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${backendUrl}/api/worker/get-profile`, {}, {
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

  useEffect(() => {
    fetchWorkerDetails();
    fetchAttendance();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-2">
      <h2 className="text-sm font-semibold text-gray-800 mb-2">Attendance</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Name: {workerDetails.fullname}</p>
        <p className="text-sm text-gray-600">Position: {workerDetails.position}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Status: {attendance.signedIn ? 'Signed In' : 'Signed Out'}</p>
        {attendance.startTime && (
          <p className="text-sm text-gray-600">Start Time: {attendance.startTime.toLocaleString()}</p>
        )}
        {attendance.endTime && (
          <p className="text-sm text-gray-600">End Time: {attendance.endTime.toLocaleString()}</p>
        )}
        <p className="text-sm text-gray-600">Shift: {attendance.shift}</p>
      </div>
    </div>
  );
};

export default WorkerAttendance;
