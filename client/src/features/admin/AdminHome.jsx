import React from 'react'
import Nav from './Nav'
import decs from "../../assets/decs.png"
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, } from "react-icons/fa";
import { MdPeople } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
const AdminHome = () => {
    ///this page woudl contain all the functions the admin can perform 
    const navigate=useNavigate();
  return (
        <div className='flex flex-wrap justify-center gap-4 p-4 w-full '>
          <Card className="border-none flex flex-col  bg-white bg-opacity-90 w-[20%] aspect-square cursor-pointer  hover:scale-105 hover:ease-in transition-all " onClick={()=>{
            navigate('/admin/manageEvents')
          }}>
                  <CardHeader>
                      <CardTitle>
                        <FaPlus className='text-red-600 text-5xl'/>
          
                      </CardTitle>
                  </CardHeader>
                  <CardFooter>
                  <h1 className='text-3xl m-0 ml-auto self-center font-medium'>Manage Events</h1>
                  </CardFooter>
              </Card>
        
            <Card className="border-none flex flex-col  bg-white bg-opacity-90 w-[20%] aspect-square  cursor-pointer hover:scale-105 hover:ease-in transition-all ">
                <CardHeader>
                    <CardTitle>
                      <MdPeople className='text-red-600 text-5xl'/>
                     
                    </CardTitle>

                </CardHeader>
                <CardFooter>
                <h1 className='text-3xl m-0 ml-auto self-center font-medium'>Admin Control</h1>

                </CardFooter> 
            </Card>

            <Card className="border-none flex flex-col  bg-white bg-opacity-90 w-[20%] aspect-square  cursor-pointer  hover:scale-105 hover:ease-in transition-all " >
                <CardHeader>
                    <CardTitle>
                      <TfiAnnouncement className='text-red-600 text-5xl '/>
                     
                    </CardTitle>

                </CardHeader>
                <CardFooter>
                <h1 className='text-3xl m-0 ml-auto self-center font-medium'> Announcements</h1>

                </CardFooter> 
            </Card>
              
            </div>
          
  
  )
}

export default AdminHome