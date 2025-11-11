import React, { useState, useEffect } from "react";
import { BiLoader } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { backendUrl } from "../Pages/Home";
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateAnnouncements = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/announcement`);
      if (response.data.success) {
        setAnnouncements(response.data.announcements);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching announcements');
    }
  };

  const removeAnnouncement = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/announcement/${id}`, {
        headers: {
          token: localStorage.getItem('token')
        }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchAnnouncements();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error removing announcement');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmitCreate = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/announcement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        alert("Announcement created successfully!");
        setShowModal(false);
        setFormData({ title: "", body: "", category: "" });
        fetchAnnouncements(); // Refresh the list after creating
      } else {
        alert(result.message || "Failed to create announcement");
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("Error creating announcement");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="pl-4 md:pl-8">
      <h1 className="text-lg font-bold mb-4">Announcements</h1>
      <button
        onClick={() => setShowModal(true)}
        className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 text-sm"
      >
        Create Announcement
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50">
          {/* Non-clickable overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white shadow-2xl rounded-lg">
            <MdClose
              className="absolute top-4 right-4 cursor-pointer"
              onClick={closeModal}
            />

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b-2 border-gray-200 pb-2 py-5">
                Create Announcement
              </h3>
              <form
                className="px-3 flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitCreate({
                    title: formData.title,
                    body: formData.body,
                    category: formData.category,
                  });
                }}
              >
                <div className="flex flex-col gap-1 ">
                  <p className="font-semibold text-lg">Title </p>
                  <input
                    className="capitalize rounded-md p-2 border-[1px] border-neutral-500"
                    type="text"
                    value={formData.title}
                    name="title"
                    onChange={handleChange}
                    id="title"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 ">
                  <p className="font-semibold text-lg">Body</p>
                  <textarea
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    id="body"
                    required
                    className="capitalize rounded-md p-2 border-[1px] border-neutral-500 w-full h-40"
                  ></textarea>
                </div>
                <div className="flex flex-col gap-1 ">
                  <p className="font-semibold text-lg">Category</p>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    id="category"
                    required
                    className="capitalize rounded-md p-2 border-[1px] border-neutral-500"
                  >
                    <option value="">Select Category</option>
                    {/* <option value="Exams">Exams</option> */}
                    <option value="General Notices">General Notices</option>
                    {/* <option value="Events">Events</option> */}
                  </select>
                </div>
                <button
                  className="bg-green-600 p-2 text-white rounded-md w-full flex items-center justify-center gap-1"
                  type="submit"
                >
                  Send
                  {loading && <BiLoader className="animate-spin" />}
                </button>
                <p className="bg-green-100 rounded-md p-2 text-black text-sm mb-6">
                  Note: This announcement will only be sent to students in your
                  department
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Announcements Table */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Existing Announcements</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-1 px-2 border-b text-sm">Title</th>
                <th className="py-1 px-2 border-b text-sm">Body</th>
                <th className="py-1 px-2 border-b text-sm">Category</th>
                <th className="py-1 px-2 border-b text-sm">Date</th>
                <th className="py-1 px-2 border-b text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement) => (
                <tr key={announcement._id} className="hover:bg-gray-50">
                  <td className="py-1 px-2 border-b text-sm">{announcement.title}</td>
                  <td className="py-1 px-2 border-b text-sm">{announcement.body}</td>
                  <td className="py-1 px-2 border-b text-sm">{announcement.category}</td>
                  <td className="py-1 px-2 border-b text-sm">{new Date(announcement.date).toLocaleDateString()}</td>
                  <td className="py-1 px-2 border-b">
                    <button
                      onClick={() => removeAnnouncement(announcement._id)}
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
    </div>
  );
};

export default CreateAnnouncements;
