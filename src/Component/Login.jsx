import React from 'react'
import { backendUrl } from '../App.jsx'
import axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = ({ setToken, onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL || '');
  const [password, setPassword] = useState(import.meta.env.VITE_ADMIN_PASSWORD || '');
  const [showPassword, setShowPassword] = useState(false);

  const adminLoginHandler = async (e) => {
    try {
      e.preventDefault()
      const response = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (response.data.success) {
        setToken(response.data.token)
        localStorage.setItem('token', response.data.token)
        onClose(); // Close the modal on successful login
        window.location.reload(); // Force reload to apply token
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      console.log(error);
      alert('Login failed')
    }
  }

  return (
    <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md relative'>
      <button onClick={onClose} className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'>×</button>
      <h1 className='text-2xl font-bold text-center text-gray-800 mb-4'>Admin Login</h1>
      <form onSubmit={adminLoginHandler}>
        <div className='mb-4'>
          <p className='text-sm font-semibold text-gray-600 mb-2'>Email Address</p>
          <input type="email" placeholder="Enter admin email" value={email} onChange={(e) => setEmail(e.target.value)} className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gray-800' />
        </div>
        <div className='mb-4'>
          <p className='text-sm font-semibold text-gray-600 mb-2'>Password</p>
          <div className='relative'>
            <input type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className='w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gray-800' />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className='absolute inset-y-0 right-0 pr-3 flex items-center'>
              {showPassword ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400' />}
            </button>
          </div>
        </div>
        <div>
          <button className='w-full px-3 py-2 text-lg font-bold bg-purple-900 text-white rounded-md' type="submit">Login</button>
        </div>
      </form>
    </div>
  )
}

export default Login
