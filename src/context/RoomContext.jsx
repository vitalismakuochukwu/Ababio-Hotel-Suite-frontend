import React, { createContext, useState, useEffect } from 'react';
import { roomData } from '../assets/asset';
import axios from 'axios';

const backendUrl = "https://hotel-and-suit-backend.onrender.com"

const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Load room data
    setRooms(roomData);
  }, []);

  const fetchRoom = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/hotel/list`)
      if (response.data.success) {
        setRooms(response.data.hotels)
      } else {
        console.log(response.data.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRoom()
  }, [])

  return (
    <RoomContext.Provider value={{ rooms, fetchRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export { RoomContext };
export default RoomProvider;
