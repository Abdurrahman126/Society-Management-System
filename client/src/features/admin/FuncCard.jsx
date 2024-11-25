import React from 'react'
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
import { FaPlus, } from "react-icons/fa";
import { MdPeople } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { RiTeamFill } from "react-icons/ri";
import { SiGooglemeet } from "react-icons/si";
import { useNavigate } from 'react-router-dom'
import { TbCirclePercentageFilled } from "react-icons/tb";
import { GoCommentDiscussion } from "react-icons/go";



const FuncCard = ({redirectTo,icon,heading}) => {
    const navigate=useNavigate();

    const iconComp=(compIcon)=>{
        if(compIcon==="FaPlus"){
            return(
                <FaPlus className='text-red-600 text-5xl'/>
            )
        }
        else if(compIcon==="MdPeople"){
           return(
            <MdPeople className='text-red-600 text-5xl'/>
           )     
        }
        else if(compIcon==="TfiAnnouncement"){
            return(
            <TfiAnnouncement className='text-red-600 text-5xl '/>
            ) 
        }
        else if(compIcon==="RiTeamFill"){
            return(
            <RiTeamFill className='text-red-600 text-5xl '/>
            )       
        }
        else if(compIcon==="SiGooglemeet"){
           return(
            <SiGooglemeet className='text-red-600 text-5xl '/>
           )
        }
        else if(compIcon==="percent"){
            return(
                <TbCirclePercentageFilled className='text-red-600 text-5xl '/>
            )
        }
        else if(compIcon==="discussion"){
            return(
                <GoCommentDiscussion className='text-red-600 text-5xl '/>
            )
        }
    }

  return (
    <Card className="border-none flex flex-col  bg-white bg-opacity-90 w-[20%] aspect-square  cursor-pointer hover:scale-105 hover:ease-in transition-all "  onClick={()=>{
        navigate(`${redirectTo}`)}}>
            <CardHeader>
                <CardTitle>
                 {iconComp(icon)}
                </CardTitle>

            </CardHeader>
            <CardFooter>
            <h1 className='text-3xl m-0 ml-auto self-center font-medium'>{heading}</h1>

            </CardFooter> 
        </Card>

  )
}

export default FuncCard