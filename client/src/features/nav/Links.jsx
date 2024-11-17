import React from 'react'
import { Link ,useLocation} from 'react-router-dom'
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
    <Link to="/events" className='cursor-pointer'>Events</Link>
    <span className='cursor-pointer'>Inductions</span>
    <span className='cursor-pointer'>Certifications</span>
    <NavigationMenu className="">
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
    {location.pathname!="/login" && <Link to="/login">  <button className="text-white bg-red-700 rounded-xl p-1 text-xs lg:text-base lg:p-2 lg:px-6 lg:rounded-3xl ">Join Us</button></Link>
}

    </>
   
  )
}

export default Links