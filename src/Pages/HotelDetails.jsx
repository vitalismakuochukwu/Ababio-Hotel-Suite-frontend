import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { RoomContext } from '../context/RoomContext'
import axios from "axios"
import { FaConciergeBell, FaSwimmingPool, FaTv, FaUtensils, FaWifi } from 'react-icons/fa'

const backendUrl = "http://localhost:3000"

const amenitiesList =[
  {label: "Wi-fi",icon: <FaWifi className='text-grey-600'/>},
  {label: "Cable Tv",icon: <FaTv  className='text-grey-600'/>},
  {label: "Restaurant", icon: <FaUtensils  className='text-grey-600'/>},
  {label: "Pool", icon: <FaSwimmingPool  className='text-grey-600'/>},
  {label: "Room Service", icon: <FaConciergeBell  className='text-grey-600'/>}
]

const HotelDetails = () => {

  const { id } = useParams()
  const { rooms } = useContext(RoomContext)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [roomGroup, setRoomGroup] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkin: '',
    checkout: '',
    guests: 1,
    roomName: '',
    roomId: ''
  })

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/hotel/rooms/${id}`)
        setSelectedRoom(response.data.hotel)
        setFormData(prev => ({
          ...prev,
          roomName: response.data.hotel.name,
          roomId: response.data.hotel._id
        }))
      } catch (error) {
        console.log(error)
      }
    }
    fetchRoom()
  }, [id])

  useEffect(() => {
    if (rooms.length > 0 && selectedRoom) {
      // Find all rooms with the same name
      const group = rooms.filter(r => r.name === selectedRoom.name)
      setRoomGroup(group)
    }
  }, [selectedRoom, rooms])

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${backendUrl}/api/reservation/create`, formData)
      if (response.data.message === "Reservation created successfully") {
        alert('Reservation successful!')
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          checkin: '',
          checkout: '',
          guests: 1,
          roomName: '',
          roomId: ''
        })
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      console.log(error)
      alert('Error making reservation')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!selectedRoom) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className='mx-auto max-w-7xl p-6'>
      {/* Mobile layout */}
      <div className='block md:hidden'>
        <div>
          <h1 className='text-3xl font-bold'>{selectedRoom.name}</h1>
          <p className='text-xl text-purple-500 mt-1'>${selectedRoom.price}</p>
        </div>
        <img src={selectedRoom.image} alt={selectedRoom.name} className='w-full rounded-lg shadow-md mb-4'/>
        <div className='bg-gray-100 p-4 rounded-lg shadow-md mb-4'>
          <h2 className='text-xl font-semibold mb-3'>Amenities</h2>
          <div className='grid grid-cols-2 gap-4 text-gray-700'>
            {
              amenitiesList.map((amenity) =>
              <div key={amenity.label} className='flex items-center gap-2'>
                {amenity.icon} {amenity.label}
              </div>
              )
            }
          </div>
          <div>
            <h2 className='text-lg font-semibold mb-2'>Room Description</h2>
            <p className='text-gray-600'>{selectedRoom.description}</p>
            <p className='text-gray-600'>{selectedRoom.description}</p>
            <p className='text-gray-600'>{selectedRoom.description}</p>
            <p className='text-gray-600'>{selectedRoom.description}</p>
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-2xl font-bold mb-4'>Book Your Stay</h2>
          <form onSubmit={handleFormSubmit} className='space-y-4'>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder='Name' className='w-full border border-gray-300 p-3 rounded-lg'/>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder='Email' className='w-full border border-gray-300 p-3 rounded-lg'/>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder='Phone number' className='w-full border border-gray-300 p-3 rounded-lg'/>
            <div>
              <label htmlFor='checkin' className='font-bold'>Check-In</label>
              <input type="date" id="checkin" name="checkin" value={formData.checkin} onChange={handleInputChange} className='w-full border border-gray-300 p-3 rounded-lg'/>
            </div>
            <div>
              <label htmlFor='checkout' className='font-bold'>Check-Out</label>
              <input type="date" id="checkout" name="checkout" value={formData.checkout} onChange={handleInputChange} className='w-full border border-gray-300 p-3 rounded-lg'/>
            </div>
            <div>
              <label htmlFor='guests' className='font-bold'>Number of Guests</label>
              <select id='guests' name="guests" value={formData.guests} onChange={handleInputChange} className='w-full p-3 mb-3 rounded-lg focus:ring focus:ring-blue-500'>
                {[...Array(5).keys()].map((i)=>(
                  <option key={i+1} value={i+1}>{i+1} Guest(s)</option>
                ))}
              </select>
            </div>
            <button type='submit' className='w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition'>Book Now</button>
          </form>
        </div>

          {roomGroup.length > 1 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Available Rooms in this Category</h2>
              <div className="flex gap-6 overflow-x-auto">
                {roomGroup.map((room) => (
                <div
                  key={room._id}
                  className={`flex-shrink-0 min-w-[200px] p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    room._id === selectedRoom._id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <img src={room.image} alt={room.name} className="w-full h-32 object-cover rounded mb-2" />
                  <h3 className="font-semibold">Room {room._id}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">${room.price}</p>
                </div>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Desktop layout */}
      <div className='hidden md:grid grid-cols-1 lg:grid-cols-4 gap-10'>
        {/* left side */}
        <div className='lg:col-span-2'>
          <div>
            <h1 className='text-3xl font-bold'>{selectedRoom.name}</h1>
            <p className='text-xl text-purple-500 mt-1'>${selectedRoom.price}</p>
          </div>
          <img src={selectedRoom.image} alt={selectedRoom.name} className='w-full rounded-lg shadow-md'/>
          <div className='bg-gray-100 p-4 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-3'>Amenities</h2>
            <div className='grid grid-cols-2 gap-4 text-gray-700'>
              {
                amenitiesList.map((amenity) =>
                <div key={amenity.label} className='flex items-center gap-2'>
                  {amenity.icon} {amenity.label}
                </div>
                )
              }
            </div>
            <div>
              <h2 className='text-lg font-semibold mb-2'>Room Description</h2>
              <p className='text-gray-600'>{selectedRoom.description}</p>
              <p className='text-gray-600'>{selectedRoom.description}</p>
              <p className='text-gray-600'>{selectedRoom.description}</p>
              <p className='text-gray-600'>{selectedRoom.description}</p>
            </div>
          </div>

          {roomGroup.length > 1 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Available Rooms in this Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roomGroup.map((room) => (
                <div
                  key={room._id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    room._id === selectedRoom._id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <img src={room.image} alt={room.name} className="w-full h-32 object-cover rounded mb-2" />
                  <h3 className="font-semibold">Room {room._id}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">${room.price}</p>
                </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* right side */}
        <div className='bg-white p-4 rounded-lg shadow-md max-w-sm'>
          <h2 className='text-2xl font-bold mb-4'>Book Your Stay</h2>
          <form onSubmit={handleFormSubmit} className='space-y-4'>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder='Name' className='w-full border border-gray-300 p-3 rounded-lg'/>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder='Email' className='w-full border border-gray-300 p-3 rounded-lg'/>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder='Phone number' className='w-full border border-gray-300 p-3 rounded-lg'/>
            <div>
              <label htmlFor='checkin' className='font-bold'>Check-In</label>
              <input type="date" id="checkin" name="checkin" value={formData.checkin} onChange={handleInputChange} className='w-full border border-gray-300 p-3 rounded-lg'/>
            </div>
            <div>
              <label htmlFor='checkout' className='font-bold'>Check-Out</label>
              <input type="date" id="checkout" name="checkout" value={formData.checkout} onChange={handleInputChange} className='w-full border border-gray-300 p-3 rounded-lg'/>
            </div>
            <div>
              <label htmlFor='guests' className='font-bold'>Number of Guests</label>
              <select id='guests' name="guests" value={formData.guests} onChange={handleInputChange} className='w-full p-3 mb-3 rounded-lg focus:ring focus:ring-blue-500'>
                {[...Array(5).keys()].map((i)=>(
                  <option key={i+1} value={i+1}>{i+1} Guest(s)</option>
                ))}
              </select>
            </div>
            <button type='submit' className='w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition'>Book Now</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default HotelDetails
