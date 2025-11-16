import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../config';

const WorkerAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

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

  useEffect(() => {
    fetchAnnouncements();
  }, []);

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
  );
};

export default WorkerAnnouncements;
