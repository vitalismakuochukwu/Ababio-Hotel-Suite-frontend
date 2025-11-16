import React, { useState } from 'react'
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa'
import WorkerLogin from './WorkerLogin'

const Footer = ({ setToken }) => {
  const [showWorkerLoginModal, setShowWorkerLoginModal] = useState(false);

  return (
    <div className='flex flex-col gap-12 px-16 py 16 bg-black text-white'>
      <div className='grid place-content-center gap-6 text-center '>
        <h2 className='text-2xl md:text-4xl mt-20 font-bold'>Sign Up for Execlusive Offer</h2>
        <div className='flex items-center justify-center max-w-xl mx-auto w-full'>
          <input type="email" placeholder="Enter your email address" className='flex-grow px-4 md:px-10 py-2 md:py-4 border-2 border-r-0 border-purple-500 rounded-l-full outline-none text-sm'/>
          <button className='bg-purple-400 text-white px-4 md:px-8 py-2 md:py-4 rounded-r-full font-bold'>Join Now</button>
      </div>
      </div>

      {/* buuton switch */}
      <div className='flex flex-col justify-between items-center text-center gap-6'>
        <div>
        <h2 className='text-lg md:text-2xl font-bold'>ABABIO HOTEL & SUITE</h2>
          <div className='flex justify-center gap-4 mt-3 text-purple-500 '>
            <FaTwitter className='text-3xl cursor-pointer'/>
            <FaFacebook className='text-3xl cursor-pointer'/>
            <FaLinkedin className='text-3xl cursor-pointer'/>

          </div>
        </div>
        <div>
          <ul className='flex gap-6 justify-center text-sm md:text-base font-medium'>
            <li className='cursor-pointer' onClick={() => document.getElementById('hero').scrollIntoView({ behavior: 'smooth' })}>HOME</li>
                  <li className='cursor-pointer' onClick={() => document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' })}>ROOMS</li>
                                 <li className='cursor-pointer' onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>SERVICES</li>
                     <li className='cursor-pointer' onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>CONTACT</li>
          </ul>
          <div className='mt-6'>
            <button
              onClick={() => setShowWorkerLoginModal(true)}
              className='bg-purple-500 text-white p-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors'
              title="Worker Portal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
       <p className='text-center text-sm mt-4'>@ 2025 ABABIO HOTELS & SUITES, All rights reserved</p>

      {/* Worker Login Modal */}
      {showWorkerLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <WorkerLogin
            setToken={setToken}
            onClose={() => setShowWorkerLoginModal(false)}
          />
        </div>
      )}
    </div>
  )
}

export default Footer
