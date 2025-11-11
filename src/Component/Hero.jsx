import React from 'react'
import bg from "../assets/beach.avif"
import StarBackground from './StarBackground'

const Hero = () => {
  return (
    <div className='relative h-[100vh] w-full'>
      <StarBackground />
      <div className='absolute inset-0 bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(${bg})` }}></div>
      <div className='absolute inset-0 bg-gray-900 opacity-80 z-10'>
        <div className='relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4'>
          <h2 className='text-lg  tracking-widest uppercase mb-4'>Where Luxury Meets Dinner</h2>
          <h1 className='text-4xl font-bold mb-6'>ABABIO HOTEL & SUITE</h1>
          <button className='bg-purple-500 hover:bg-white hover:text-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-colors'>Book Now</button>
        </div>
      </div>
    </div>
  )
}

export default Hero
