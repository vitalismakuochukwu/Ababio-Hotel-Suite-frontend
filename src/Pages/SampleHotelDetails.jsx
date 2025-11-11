import React from 'react'
import { roomData } from '../assets/asset'
import { useParams } from 'react-router-dom'
import { FaConciergeBell, FaSwimmingPool, FaTv, FaUtensils, FaWifi } from 'react-icons/fa'

const SampleHotelDetails = () => {
    const {id} = useParams()
    const room =roomData.find((room) =>{
        return room.id ===parseInt(id)
    })
  return (
    <div className='mx-auto max-w-7xl p-6 grid grid-cols-1 gap-8'>
        {/* left side */}
      <div className='mt:col-span-2 span-y-6'>
        <div>
            <h1 className='text-3xl font-bold'>{room.name}</h1>
            <p className='text-xl text-purple-500 mt-1'>{room.price}</p>
        </div>
        <img src="room.image" alt='' className='w-full rounded-lg shadow-md'/>
        <div className='pg-gray-100 p-4 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-3'> Amenities</h2>
           <div className='grid grid-cols-2 gap-4 text-gray-700'>
             <div className='flex items-center gap-2'>
                <FaWifi/> Wi-fi
            </div>
            <div className='flex items-center gap-2'>
            <FaTv/> Cable Tv
            </div>
               <div className='flex items-center gap-2'>
                <FaUtensils/>Resturant
               </div>
                  <div className='flex items-center gap-2'>  
                    <FaSwimmingPool/>Pool
                  </div>
                     <div className='flex items-center gap-2'>
                        <FaConciergeBell/>Room Service
                     </div>
           </div>
           <div>
            <h2 className='text-lg font-semibold mb-2'>Room Description</h2>
            <p className='text-gray-600'>{room.description}</p>
             <p className='text-gray-600'>{room.description}</p>
              <p className='text-gray-600'>{room.description}</p>
             <p className='text-gray-600'>{room.description}</p>
           </div>
        </div>
      </div>
       {/* right side */}
      <div className='bg-white p-6 mt-18 rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-4'>Book Your Stay</h2>
        <form className='space-y-4'>
            <input type="name" placeholder='Name' className='w-full border border-gray-300 p-3 rounded-lg'/>
                        <input type="email" placeholder='Email'className='w-full border border-gray-300 p-3 rounded-lg'/>
                                    <input type="tel" placeholder='Phone number'className='w-full border border-gray-300 p-3 rounded-lg'/>
            <div>
                <label htmlFor='date' className='font-bold'>Check-In </label>
                <input type="date" name="" id=""className='w-full border border-gray-300 p-3 rounded-lg'/>
            </div>
            <div>
                <label htmlFor='date' className='font-bold'>Check-Out</label>
                 <input type="date" name="" id="" className='w-full border border-gray-300 p-3 rounded-lg'/>
            </div>
            <div>
                <label htmlFor='' className='font-bold'>Number of Guests</label>
                <select name='' id='' className='w-full p-3 mb-3 rounded-lg focus:ring focus:ring-blue '>
                    {[...Array(3).keys().map((i)=>(
                        <option key={i+1} value={i+1}>{i+1} Guest(s)</option>
                        
                    ) )]}
                </select>
            </div>
            <button type='submit' className='w-full bg-purple-400 text-white p-3 rounded-lg hover:bg-white-300 transition'>Book Now</button>
        </form>
      </div>
    </div>
  )
}

export default SampleHotelDetails
