import React from 'react'
import Events from '@/components/Events'
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export async function loader()
{

    try {
        const response = await fetch('https://alimurtazaathar.pythonanywhere.com/api/events'); 
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



const EventPage = () => {

    const array=useLoaderData();
    
  const navigate=useNavigate();
    

    const events=array.map((item)=>{
        return(
        <Events key={item.event_id} id={item.event_id} name={item.event_title}
        description={item.about_event} eventOn={item.event_date} btnAction={()=>{
          navigate(`/events/${item.event_id}`)
      }}/>
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