import React from 'react'
//this is redundant we will delete it later
import Events from '@/components/Events';
import { useLoaderData } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaPlus, } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { eventDeleted, eventsFetched } from '../event/eventSlice';

export async function loader()
{

    try {
        const response = await fetch('http://127.0.0.1:5001/api/events'); 
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        return data;
      }
      catch(error){
        console.log(error.message);
        return null;
      }
}


const EventsHandler = () => {

  const array=useLoaderData();
  const dispatch=useDispatch();
  dispatch(eventsFetched(array));

  const events=array.map((item)=>{
    return(
    <Events key={item.event_id} id={item.event_id} name={item.event_title}
    description={item.about_event} eventOn={item.event_date} btnAction={()=>{dispatch(eventDeleted(item.event_id))}} tag="Delete Event"/>
    )
})



  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
        <h1 className='text-white text-3xl'>Events Live</h1>
        <div className='flex justify-evenly items-stretch flex-wrap gap-y-5'>
    {events}
    <Card className="border-none flex flex-col justify-center items-center  bg-white bg-opacity-90 w-[20%] aspect-square cursor-pointer  " 
            >
                  <CardHeader>
                      <CardTitle className="flex justify-center items-center">
                        <FaPlus className=' border-gray-500 rounded-3xl p-2 bg-gray-500 text-5xl  hover:scale-105 hover:ease-in transition-all'/>
          
                      </CardTitle>
                      <CardFooter>
                        Add Event
                      </CardFooter>
                  </CardHeader>
              </Card>
        
</div>
    </div>
  )
}

export default EventsHandler