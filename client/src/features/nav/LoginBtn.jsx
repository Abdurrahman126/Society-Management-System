import React from 'react'
import { useLocation,Link } from 'react-router-dom'
const LoginBtn = () => {

     const location=useLocation();
  return (
    <>
    {location.pathname!="/login" && <Link to="/login">  <button className="text-white bg-red-700 rounded-xl p-1 text-xs lg:text-base lg:p-2 lg:px-6 lg:rounded-3xl ">Join Us</button></Link>
    }
    </>
  )
}

export default LoginBtn