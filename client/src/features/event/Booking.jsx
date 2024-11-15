import { Description } from '@radix-ui/react-dialog';
import React from 'react'
import {Form} from 'react-router-dom'
export function loader({ params }) {
    //fetch data for params.id
    //example
    const eventurl = `https://api.themoviedb.org/3/movie/${params.id}?language=en-US`;
    //make fetch request 

    //once fetched change null to the data variable;
    return null;
}

export async function action(){
    //ignore this function for now
  return null;
}

const Booking = () => {

    //uncomment this line when data has fetched
    // const data=useLoaderData();

    //random data used for now
    const data = {event_id:1,event_title:"Annual Tour",about_event:"Pack your bags and let’s make memories! ✨Annual Tour '25 is almost here with amazing spots and fun activities lined up. Don’t miss out on this epic journey!"
        ,event_date:"2024-12-31",price:1500};

    return (
        <div className=' flex flex-col justify-evenly  h-screen w-full'>
    
           
            <div className='flex flex-col justify-evenly h-[80%] lg:h-[75%] lg:border lg:rounded-lg lg:border-[rgba(39,40,53,255)] lg:py-1  px-7  lg:mx-auto lg:w-[50%] max-w-md bg-white' >
            <h1>Needs CSS</h1>
            <Form action="flask local host server path " method="post" className='flex flex-col'>
                <label htmlFor='name' className='text-black'>Name:</label>
                <input name="name" type="text" required className='bg-gray-300 rounded-lg'/>

                <label htmlFor='batch' className='text-black'>Batch</label>
                <input name="batch" type="text" required className='bg-gray-300 rounded-lg'/>
                
                <label htmlFor='email' className='text-black'>Nu Email:</label>
                <input name="email" type="email" required className='bg-gray-300 rounded-lg'/>
                
                <label htmlFor='number'  className='text-black'>Phone</label>
                <input name="number" type="number"  required className='bg-gray-300 rounded-lg'/>
                
                <label htmlFor='number'  className='text-black'>Transaction Code</label>
                <input name="number" type="number"  required className='bg-gray-300 rounded-lg'/>
                
            </Form>
                <div className=''>
                    <span className='text-detailColor block'>Total Payment:</span>
                    <span className='text-yellow-500 text-2xl'>Rs.{data.price}</span>
                </div>

            </div>
            <div className='lg:w-[50%] max-w-md lg:mx-auto px-7 lg:px-0'>

                <button className='w-full bg-red-700 text-gray-300 border-none rounded py-2  flex items-center justify-center  cursor-pointer hover:brightness-90 lg:text-2xl text-base lg:tracking-widest lg:mx-auto ' type="submit" >
                    Confirm Payment
                </button>


            </div>

        </div>
    )
}

export default Booking