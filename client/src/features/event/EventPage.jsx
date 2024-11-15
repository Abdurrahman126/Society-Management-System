import React from 'react'
import Events from '@/components/Events'
import { useLoaderData } from 'react-router-dom';

export function loader(){
    //fetch request made from database to fetch live event details and store it in an array of objects

    //change this null to array name
    return null;
}



const EventPage = () => {

    //delete this once data has been fetched
    const randomEvents=[{event_id:1,event_title:"Annual Tour",about_event:"Pack your bags and let’s make memories! ✨Annual Tour '25 is almost here with amazing spots and fun activities lined up. Don’t miss out on this epic journey!"
 ,event_date:"2024-12-31"},{
    event_id:2,
    event_title:"Annual Dinner",
    about_event:"The much-anticipated DECS Annual Dinner 2025 is on the horizon! An evening filled with gourmet delights, dazzling performances, and unforgettable memories as we gather together to celebrate another incredible year of the AD'25."
,
event_date:"2024-12-30"}]

    const array=useLoaderData();

    //once data has been fetched change "randomEvents" to "array"
    const events=randomEvents.map((item)=>{
        return(
        <Events key={item.id} id={item.event_id} name={item.event_title}
        description={item.about_event} eventOn={item.event_date}/>
        )
    })


  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
        <h1 className='text-white text-3xl'>Live Events</h1>
        <div className='flex justify-evenly items-stretch flex-wrap'>
    {events}
</div>
    </div>
  )
}

export default EventPage