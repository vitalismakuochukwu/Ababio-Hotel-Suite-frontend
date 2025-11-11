import React from 'react'
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const WorkerLogin = ({ setToken, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState(localStorage.getItem('workerEmail') || '');
  const [password, setPassword] = useState(localStorage.getItem('workerPassword') || '');
  const [showPassword, setShowPassword] = useState(false);

  const workerLoginHandler = async (e) => {
    try {
      e.preventDefault()
      const response = await fetch('http://localhost:3000/api/worker/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: email, Password: password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('worker-token', data.token);
        localStorage.setItem('workerEmail', email);
        localStorage.setItem('workerPassword', password);
        onClose(); // Close the modal on successful login
        window.location.href = '/worker/dashboard'; // Redirect to worker dashboard
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.log(error);
      alert('Login failed')
    }
  }

  return (
    <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md relative'>
      <button onClick={onClose} className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'>×</button>
      <h1 className='text-2xl font-bold text-center text-black mb-4'>Worker Login</h1>
      <form onSubmit={workerLoginHandler}>
        <div className='mb-4'>
          <p className='text-sm font-semibold text-black mb-2'>Email Address</p>
          <input type="email" placeholder="Enter worker email" value={email} onChange={(e) => setEmail(e.target.value)} className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:border-gray-800' />
        </div>
        <div className='mb-4'>
          <p className='text-sm font-semibold text-black mb-2'>Password</p>
          <div className='relative'>
            <input type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className='w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:border-gray-800' />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className='absolute inset-y-0 right-0 pr-3 flex items-center'>
              {showPassword ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400' />}
            </button>
          </div>
        </div>
        <div>
          <button className='w-full px-3 py-2 text-lg font-bold bg-purple-900 text-white rounded-md' type="submit">Login</button>
        </div>
      </form>
      {/* <div className='mt-4 text-center'>
        <p className='text-sm text-gray-600'>Do you already have an account? <button onClick={onSwitchToRegister} className='text-purple-600 hover:text-purple-800 font-semibold'>Register here</button></p>
      </div> */}
    </div>
  )
}

export default WorkerLogin
