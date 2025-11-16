import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../config';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/attendance`, {
        headers: {
          'admin-token': localStorage.getItem('token')
        }
      });
      if (response.data.success) {
        setAttendance(response.data.attendance);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching attendance');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (workerId, status, shift) => {
    try {
      const response = await axios.post(`${backendUrl}/api/attendance/mark`, {
        workerId,
        status,
        shift,
        date: new Date().toISOString().split('T')[0]
      }, {
        headers: {
          'admin-token': localStorage.getItem('token')
        }
      });

      if (response.data.success) {
        toast.success(`Attendance marked as ${status} for ${shift} shift`);
        // Refresh the page to show updated status and return to action buttons
        window.location.reload();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error marking attendance');
    }
  };

  const generateReport = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/worker/getAttendance`, {
        headers: {
          'admin-token': localStorage.getItem('token')
        }
      });

      if (response.data) {
        // Group records by worker and date
        const groupedData = {};
        response.data.forEach(record => {
          const key = `${record.workerId?._id || record.workerId}-${record.date}`;
          if (!groupedData[key]) {
            groupedData[key] = {
              'Name': record.workerId?.Name || record.fullname,
              'Email': record.workerId?.Email || record.email,
              'Position': record.workerId?.Position || record.position,
              'Morning Status': 'Not marked',
              'Afternoon Status': 'Not marked',
              'rawDate': record.date
            };
          }
          if (record.shift === 'morning') {
            groupedData[key]['Morning Status'] = record.status;
          } else if (record.shift === 'afternoon') {
            groupedData[key]['Afternoon Status'] = record.status;
          }
        });

        let reportData = Object.values(groupedData).map((record, index) => ({
          'S/N': index + 1,
          ...record
        }));

        // Filter by selected date if provided
        if (selectedDate) {
          const selectedDateObj = new Date(selectedDate);
          reportData = reportData.filter(record => {
            const recordDate = new Date(record.rawDate);
            return recordDate.toDateString() === selectedDateObj.toDateString();
          });
        }

        setReportData(reportData);
        setShowReport(true);
        toast.success('Attendance report generated successfully.');
      } else {
        toast.error('No attendance data found');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error generating attendance report');
    }
  };

  const filteredAttendance = attendance.filter(record =>
    record.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="bg-purple-400 p-8">
      <h1 className="text-lg font-bold mb-6">Worker Attendance</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-0.4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
          <button
            onClick={generateReport}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-purple-600 text-sm"
          >
            Attendance Report
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className=" bg-purple-400 min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">S/N</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Gender</th>
              <th className="py-2 px-4 border-b">Position</th>
              <th className="py-2 px-4 border-b">Morning Shift</th>
              <th className="py-2 px-4 border-b">Afternoon Shift</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((record, index) => (
              <tr key={record._id} className="bg-purple-400  hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b">{record.fullname}</td>
                <td className="py-2 px-4 border-b">{record.email}</td>
                <td className="py-2 px-4 border-b">{record.gender}</td>
                <td className="py-2 px-4 border-b">{record.position}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex gap-2">
                    <button
                      onClick={() => markAttendance(record.workerId, 'present', 'morning')}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Present
                    </button>
                    <button
                      onClick={() => markAttendance(record.workerId, 'absent', 'morning')}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => markAttendance(record.workerId, 'sick', 'morning')}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Sick
                    </button>
                    <button
                      onClick={() => markAttendance(record.workerId, 'leave', 'morning')}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Leave
                    </button>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex gap-2">
                    <button
                      onClick={() => markAttendance(record.workerId, 'present', 'afternoon')}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Present
                    </button>
                    <button
                      onClick={() => markAttendance(record.workerId, 'absent', 'afternoon')}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => markAttendance(record.workerId, 'sick', 'afternoon')}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Sick
                    </button>
                    <button
                      onClick={() => markAttendance(record.workerId, 'leave', 'afternoon')}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
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

      {showReport && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center  justify-center z-50">
          <div className="bg-purple-400 p-6 rounded-lg w-full max-w-6xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Attendance Report</h2>
              <button
                onClick={() => setShowReport(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
            <div className="mb-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  generateReport(); // Automatically filter when date is selected
                }}
                className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
              {selectedDate && (
                <div className="mt-2 text-sm font-semibold">
                  Attendance for: {new Date(selectedDate).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-purple border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b">S/N</th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Position</th>
                    <th className="py-2 px-4 border-b">Morning Status</th>
                    <th className="py-2 px-4 border-b">Afternoon Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-center">{record['S/N']}</td>
                      <td className="py-2 px-4 border-b">{record['Name']}</td>
                      <td className="py-2 px-4 border-b">{record['Email']}</td>
                      <td className="py-2 px-4 border-b">{record['Position']}</td>
                      <td className="py-2 px-4 border-b">{record['Morning Status']}</td>
                      <td className="py-2 px-4 border-b">{record['Afternoon Status']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center mt-4">
          <p>Loading attendance data...</p>
        </div>
      )}
    </div>
  );
};

export default Attendance;
