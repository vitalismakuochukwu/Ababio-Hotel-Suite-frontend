import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../config';

const WorkerStats = ({ announcementsCount }) => {
  const [workersCount, setWorkersCount] = useState(0);

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
    fetchWorkersCount();
  }, []);

  return (
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
        <div className="text-lg font-bold text-purple-600">{announcementsCount}</div>
        <p className="text-sm text-gray-600">New messages</p>
      </div>
    </div>
  );
};

export default WorkerStats;
