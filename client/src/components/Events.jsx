import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Timer from './Timer'
import { useNavigate } from 'react-router-dom';
const Events = ({ name, description,id,eventOn}) => {

    const navigate=useNavigate();
    return (
        <div className="mt-5 w-[95%] lg:w-[40%] flex flex-col">
            <Card className="border-none flex flex-col h-full bg-white bg-opacity-90">
                <CardHeader>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className='font-medium'>Event starts in</p>
                    <Timer eventOn={eventOn}/>
                </CardContent>
                <CardFooter>
                    <button className='text-white bg-red-700 rounded-lg p-2 lg:p-3 w-full' onClick={()=>{
                        navigate(`/events/${id}`)
                    }} >Book Now</button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Events