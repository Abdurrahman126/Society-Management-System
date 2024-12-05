import React,{useState} from 'react'
import decs from '../../assets/decs.png'
import { TfiLineDouble } from "react-icons/tfi";
import { Link ,useLocation,useNavigate} from 'react-router-dom';

import { Outlet } from 'react-router-dom';
import Links from './Links';



const Navbar = () => {

  const [isOpen,setIsOpen]=useState(false);
  const navigate=useNavigate();

  return (
   <> 
    <nav className="fixed top-2 lg:top-0 left-1/2 transform -translate-x-1/2 w-[95%] lg:w-full h-10 lg:h-20 text-white bg-black bg-opacity-75 z-10 p-2  rounded-3xl lg:rounded-none  flex items-center justify-between shadow-2xl bg-brightness-150">
    <img src={decs} className='max-w-[20%] lg:max-w-[9%] p-2 lg:mr-10 cursor-pointer' onClick={()=>{
      navigate('/');
      }}/>
      <Links/>
      <TfiLineDouble className='text-2xl text-white lg:hidden lg:absolute' onClick={()=>{
        setIsOpen(isOpen=>!isOpen)
      }}/>

 </nav>
       <div className=''>
       {!isOpen && <Outlet/>}
       </div>
    </>
  )
}

export default Navbar



