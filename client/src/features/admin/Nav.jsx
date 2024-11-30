import React from 'react'
import decs from "../../assets/decs.png"
import { Outlet, useNavigate } from 'react-router-dom';
import { FaRegCircleUser } from "react-icons/fa6";
const Nav = () => {

const navigate=useNavigate();
  return (
    <div className='h-full'>
    <nav className="w-[95%] lg:w-full h-10 lg:h-20 text-white bg-black bg-opacity-75 z-10 p-2  rounded-3xl lg:rounded-none mb-  flex items-center justify-between shadow-2xl bg-brightness-150">
    <img src={decs} className='max-w-[20%] lg:max-w-[9%] p-2 lg:mr-10 cursor-pointer' onClick={()=>{
      navigate('/');
      }}/>
     <button className={`text-[px] mr-2 font-medium text-red-600 md:text-xl lg:text-3xl   lg:ease-in-out font-outfit shadow-2xl`}
                        >
                           <FaRegCircleUser  />
                        </button>
 </nav>
 <Outlet/>
   </div>
  )
}

export default Nav