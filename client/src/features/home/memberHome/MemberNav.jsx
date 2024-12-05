import React,{useState} from 'react'
import decs from '../../../assets/decs.png'
import { TfiLineDouble } from "react-icons/tfi";
import { NavLink ,useLocation,useNavigate,redirect} from 'react-router-dom';

import { Outlet } from 'react-router-dom';
import { FaRegCircleUser } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { selectRoll } from '@/features/login/loginSlice';
import { checkAuth } from './checkAuth';
export function loader(){
  const isMemberLoggedIn = checkAuth();

  if (!isMemberLoggedIn) {
    // Redirect to /admin/login if no admin is logged in
    throw redirect("/login");
  }
return null;
}

const MemberNav = () => {

  const [isOpen,setIsOpen]=useState(false);
  const navigate=useNavigate();
  const roll=useSelector(selectRoll)
  return (
   <> 
    <nav className="fixed top-2 lg:top-0 left-1/2 transform -translate-x-1/2 w-[95%] lg:w-full h-10 lg:h-20 text-white bg-black bg-opacity-75 z-10 p-2  rounded-3xl lg:rounded-none  flex items-center justify-between shadow-2xl bg-brightness-150">
    <img src={decs} className='max-w-[20%] lg:max-w-[9%] p-2 lg:mr-10 cursor-pointer' onClick={()=>{
      navigate('/');
      }}/>
        
    <div className={` flex justify-evenly items-center gap-8 mr-auto }`}>
  
      <NavLink to={`/members/attendance/${roll}`}   className={({ isActive }) => isActive ? "underline underline-offset-8 scale-110  brightness-110 cursor-pointer" : "cursor-pointer"}
      >Attendance</NavLink>
      <NavLink to="/members/meetings"   className={({ isActive }) => isActive ? "underline underline-offset-8 scale-110  brightness-110 cursor-pointer" : "cursor-pointer"}
      >Meetings</NavLink>
      </div>
      <button className={`text-[px] mr-2 font-medium text-red-600 md:text-xl lg:text-3xl   lg:ease-in-out font-outfit shadow-2xl`}
                        >
                           <FaRegCircleUser  />
                        </button>

      <TfiLineDouble className='text-2xl text-white lg:hidden lg:absolute' onClick={()=>{
        setIsOpen(isOpen=>!isOpen)
      }}/>

 </nav>
       {!isOpen && <Outlet/>}
    </>
  )
}

export default MemberNav



