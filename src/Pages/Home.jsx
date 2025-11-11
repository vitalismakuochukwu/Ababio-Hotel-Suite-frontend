import React from 'react'
import Hero from '../Component/Hero'
import HotelList from '../Component/HotelList'
import Facility from '../Component/Facility'
import Contact from '../Pages/Contact'
import Footer from '../Component/Footer'
import { ToastContainer } from 'react-toastify';

export const backendUrl = 'https://hotel-and-suit-backend.onrender.com';
const Home = ({ setToken }) => {
  return (
    <div>
      <div id="hero">
        <Hero/>
      </div>
      <div id="rooms">
        <HotelList/>
      </div>
       <div id="services">

         <Facility/>
      </div>

      <div id="contact">

        <Contact/>
      </div>
      <Footer setToken={setToken} />
      <ToastContainer/>
    </div>
  )
}

export default Home
