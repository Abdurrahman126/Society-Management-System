import React from 'react'

import { useLoaderData } from 'react-router-dom';
import MeetingCard from '@/components/MeetingCard';
export async function loader()
{

  
    try {
        const response = await fetch('http://alimurtazaathar.pythonanywhere.com/api/get_meetings'); 
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
      purpose={item.purpose} venue={item.venue} date={item.meeting_date} />
      )
  })
  
  return (
    <div className='pt-20'>
      <h1 className='text-4xl text-white'>{array.length>1?'Upcoming Meetings':"No meetings scheduled"}</h1>
        {meetings}
    </div>
  )
}

export default MemberMeetings