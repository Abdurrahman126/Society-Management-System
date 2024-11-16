import React from 'react'
import decs from '../assets/decs.png'
import { TfiLineDouble } from "react-icons/tfi";
import { Link ,useLocation,useNavigate} from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Outlet } from 'react-router-dom';



const Navbar = () => {
  const navigate=useNavigate();
  return (
   <> 
    <nav className="fixed top-2 lg:top-0 left-1/2 transform -translate-x-1/2 w-[95%] lg:w-full h-10 lg:h-20 text-white bg-black bg-opacity-75 z-10 p-2  rounded-xl lg:rounded-none  flex items-center justify-between shadow-2xl">
    <img src={decs} className='max-w-[20%] lg:max-w-[9%] p-2 lg:mr-10 cursor-pointer' onClick={()=>{
      navigate('/');
      }}/>
      <div className='flex justify-evenly items-center gap-8 mr-auto'>
      <Link to="/events" className='cursor-pointer'>Events</Link>
      <span className='cursor-pointer'>Inductions</span>
      <span className='cursor-pointer'>Certifications</span>
      <NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger className="!bg-transparent !text-white">Our Team</NavigationMenuTrigger>
      <NavigationMenuContent className="flex flex-col gap-2 w-full pl-4 pr-12 bg-transparent rounded-md text-sm py-5 text-nowrap" >
      <NavigationMenuLink>Faculty Heads</NavigationMenuLink>

        <NavigationMenuLink>Excom</NavigationMenuLink>

        <NavigationMenuLink>Extended Excom</NavigationMenuLink>

        <NavigationMenuLink>Members</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
      </div>
      <TfiLineDouble className='text-2xl text-white lg:hidden lg:absolute'/>

   {location.pathname!="/login" && <Link to="/login">  <button className="text-white bg-red-700 rounded-xl p-1 text-xs lg:text-base lg:p-2 lg:px-6 lg:rounded-3xl">Join Us</button></Link>
}</nav>
    <Outlet/>
    </>
  )
}

export default Navbar



