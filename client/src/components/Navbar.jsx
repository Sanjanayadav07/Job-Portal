import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useClerk, useUser, UserButton, useSignUp } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const { openSignIn } = useClerk()
  const { isSignedIn, user } = useUser()  // ✅ include user object

  const navigate =useNavigate()
  const { setShowRecruiterLogin } = useContext(AppContext)
  //const {setShowRecruiterLogin } = useState(AppContext)

  const handleLoginClick = () => {
    if (!isSignedIn) {
      openSignIn()
    } else {
      console.log("User is already signed in.")
    }
  }

  return (
    <div className='shadow py-4'>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
        <img onClick={()=> navigate('/')} className='cursor-pointer' src={assets.logo} alt='Logo' />
        {isSignedIn ? (
          <div className='flex gap-3 items-center max-sm:text-xs'>
            <Link to="/applications">Applied Jobs</Link>
            <p> |</p>
            <p className='max-sm:hidden'>Hi, {user?.firstName} {user?.lastName}</p>
            <UserButton afterSignOutUrl='/' />
          </div>
        ) : (
          <div className='flex gap-4 max-sm:text-xs'>
            <button onClick={e=> setShowRecruiterLogin(true)} className='text-gray-600'>Recruiter Login</button>
            <button
              onClick={handleLoginClick}
              className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar

