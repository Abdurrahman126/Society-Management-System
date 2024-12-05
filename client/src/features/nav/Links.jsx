import React from 'react'
import { Link ,useLocation,NavLink} from 'react-router-dom'
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
const Links = ({hide}) => {
    const location=useLocation();
  return (
    <>
    <div className={`justify-evenly items-center gap-8 mr-auto  lg:flex ${hide?" flex flex-col":"hidden"}`}>
    <NavLink 
  to="/events" 
  className={({ isActive }) => isActive ? "underline underline-offset-8 scale-110  brightness-110 cursor-pointer" : "cursor-pointer  text-gray-300"}
>
  Events
</NavLink>

<NavLink 
  to="/inductions" 
  className={({ isActive }) => isActive ? "underline underline-offset-8 scale-110  brightness-110 cursor-pointer" : "cursor-pointer text-gray-300"}
>
  Inductions
</NavLink>

<NavLink 
  to="/forum" 
  className={({ isActive }) => isActive ? "underline underline-offset-8 scale-110 brightness-110 cursor-pointer" : "cursor-pointer text-gray-300"}
>
  Forum
</NavLink>

    </div>
    {location.pathname!="/login" && <Link to="/login">  <button className="text-white bg-red-700 rounded-xl p-1 text-xs lg:text-base lg:p-2 lg:px-6 lg:rounded-3xl ">Join Us</button></Link>
}

    </>
   
  )
}

export default Links