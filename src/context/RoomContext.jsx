import React, { createContext, useState, useEffect } from 'react';
import { roomData } from '../assets/asset';
import axios from 'axios';

import { backendUrl } from '../config';

const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Load room data
    setRooms(roomData);
  }, []);

  const fetchRoom = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/hotel/list`, { timeout: 10000 })
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
