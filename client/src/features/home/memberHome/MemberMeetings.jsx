import React from 'react'

import { useLoaderData } from 'react-router-dom';
import MeetingCard from '@/components/MeetingCard';
export async function loader()
{

  
    try {
        const response = await fetch('http://127.0.0.1:5001/api/get_meetings'); 
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

const MemberMeetings = () => {
    const array=useLoaderData();
    const meetings=array.map((item)=>{
      return(
    
      <MeetingCard key={item.meeting_id} id={item.meeting_id} title={item.title}
      purpose={item.purpose} venue={item.venue} date={item.meeting_date} btn={false}/>
      )
  })
  
  return (
    <div className='flex flex-col gap-4 flex-1 items-center justify-center pt-24'>
      <h1 className='text-4xl text-white'>{array.length>0?'Upcoming Meetings':"No meetings scheduled"}</h1>
      <div className='h-full w-full flex items-center justify-center gap-4'>
        {meetings}
        </div>
    
    </div>
  )
}

export default MemberMeetings 