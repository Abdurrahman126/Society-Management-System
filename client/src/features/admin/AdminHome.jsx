import React from 'react'
import Nav from './Nav'
import decs from "../../assets/decs.png"
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, } from "react-icons/fa";
import { MdPeople } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { RiTeamFill } from "react-icons/ri";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FuncCard from './FuncCard';



export const action = async ({ request }) => {
  const formData = new URLSearchParams(await request.formData());
  
  // Send data to your backend API
  const response = await fetch('http://127.0.0.1:5001/api/change_password', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (response.ok) {
    return  {message:data.message}
  } else {
    return { error: data.error }
  }
};



const AdminHome = () => {
    ///this page woudl contain all the functions the admin can perform 
    const navigate=useNavigate();
  return (
        <div className='flex flex-wrap justify-center gap-4 p-4 w-full '>
          
          <FuncCard redirectTo={"/admin/manageEvents"} icon="FaPlus" heading="Manage Events"/>
          
          <FuncCard redirectTo={"/admin/control"} icon="MdPeople" heading="Admin Control"/>
          
          <FuncCard redirectTo={"/admin/announce"} icon="TfiAnnouncement" heading="Manage Announcements"/>
          
          <FuncCard redirectTo={"/admin/inductions"} icon="RiTeamFill" heading="Inductions"/>
          <FuncCard redirectTo={"/admin/meeting"} icon="SiGooglemeet" heading="Meetings"/>
          <FuncCard redirectTo={"/admin/attendance"} icon="percent" heading="Attendance"/>
       


            </div>
          
  
  )
}

export default AdminHome