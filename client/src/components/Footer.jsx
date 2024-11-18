import React from 'react'
import decs from "../assets/decs.png"
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <div  className='bg-transparent text-opacity-45 w-full flex flex-col gap-1  items-center text-white text-[10px] pb-2 mt-2 lg:mt-6 shadow-2xl'>
        <img src={decs} className='w-[10%] lg:w-[5%]'/>
        <p className='-mt-2'> Follow Us On</p>
        <div className="flex space-x-4">
    <a href="https://www.facebook.com/decsfast" target='_blank'><FaFacebook className="text-blue-600" /></a>
    <FaTwitter className="text-blue-400" />
   <a href="https://www.instagram.com/decs_nuces/" target="_blank"> <FaInstagram className="text-pink-600" /></a>
    <hr/>
  </div>
        <p>&#169; DECS. All rights reserved.</p>
    </div>
  )
}

export default Footer