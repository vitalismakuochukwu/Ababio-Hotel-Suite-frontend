import React, { useContext } from 'react'
import { RoomContext } from '../context/RoomContext'
import { FaConciergeBell, FaSwimmingPool, FaTv, FaUtensils, FaWifi, FaBullhorn } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const amenitiesList =[
  {label: "Wi-fi",icon: <FaWifi className='text-grey-600'/>},
  {label: "Cable Tv",icon: <FaTv  className='text-grey-600'/>},
  {label: "Restaurant", icon: <FaUtensils  className='text-grey-600'/>},
  {label: "Pool", icon: <FaSwimmingPool  className='text-grey-600'/>},
  {label: "Room Service", icon: <FaConciergeBell  className='text-grey-600'/>}
]
const HotelList = () => {
  const {rooms} =useContext(RoomContext)
  console.log ("rooms", rooms)

  // Group rooms by name
  const groupedRooms = rooms.reduce((acc, room) => {
    if (!acc[room.name]) {
      acc[room.name] = [];
    }
    acc[room.name].push(room);
    return acc;
  }, {});

  return (
    <div className=" bg-[#f8f0eb] p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Book your stay and <br/> relax in luxury</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {
            Object.keys(groupedRooms).length > 0 ? (
              Object.keys(groupedRooms).map((roomName) => {
                const roomGroup = groupedRooms[roomName];
                const firstRoom = roomGroup[0];
                return (
                  <Link key={roomName} to={`/room/${firstRoom._id}`}>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                      <img src={firstRoom.image} alt={roomName} className="w-full h-32 object-cover rounded-md mb-3" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{roomName}</h3>
                        <p className="text-base font-bold text-purple-600 mb-3">${firstRoom.price}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{roomGroup.length} room{roomGroup.length > 1 ? 's' : ''} available</p>
                        <div className="grid grid-cols-2 gap-1">
                          {
                            amenitiesList.map((amenity) =>
                            <div key={amenity.label} className="flex items-center space-x-1">
                              {amenity.icon} <span className="text-xs">{amenity.label}</span>
                            </div>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="col-span-full text-center text-gray-500">No rooms available</p>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default HotelList
