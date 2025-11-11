import React, { useState } from 'react'
import default_img from  "../assets/rema.jpg"
import { backendUrl } from '../App'
import axios from 'axios';
// import { ToastContainer } from 'react-toastify';

const AddHotel = ({token}) => {
  const [image,setImage]=useState(null);
  const [name,setName]=useState('');
  const [price,setPrice]=useState('');
  const [description,setDescription]= useState('');
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      if (image) formData.append('image', image);


      const response =await axios.post(`${backendUrl}/api/hotel/add`, formData)

      if (response.data.success) {
        console.log(response.data.message);
        setName('');
        setDescription('');
        setPrice('');
        setImage(null);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='pl-4 md:pl-0'>
      <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-1'>
        <div>
          <p>Upload Image</p>
          <div>
            <label htmlFor='image'>
              <img src={!image ? default_img:URL.createObjectURL(image)} alt='' className='w-32 cursor-pointer'/>
              <input type="file" id='image' onChange={(e)=>setImage(e.target.files[0])} hidden/>
            </label>
          </div>
        </div>
        <div className='w-full'>
          <p className='mb-2 text-[18px]'>Room Name</p>
          <input type='text' placeholder='Enter room name' value={name} onChange={(e)=> setName(e.target.value)} className='w-full max-w-[300px] p-2 border border-gray-300 rounded-2xl'/>
        </div>
        <div className='w-full'>
          <p className='mb-2 text-[18px]'>Room Description</p>
          <input type='text' placeholder='Enter room Description' value={description} onChange={(e)=> setDescription(e.target.value)} className='w-full max-w-[300px] p-2 border border-gray-300 rounded-2xl'/>
        </div>
        <div className='w-full'>
          <p className='mb-2 text-[18px]'>Room Price</p>
          <input type='number' placeholder='40' value={price} onChange={(e)=> setPrice(e.target.value)} className='w-full max-w-[300px] p-2 border border-gray-300 rounded-2xl'/>
        </div>
        <button type='submit' className='mt-6 px-20 py-3 bg-purple-600 rounded'>Add Room</button>
      </form>


    </div>
  )
}

export default AddHotel
