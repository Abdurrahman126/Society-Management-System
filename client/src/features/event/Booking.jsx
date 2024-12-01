
import React,{useEffect, useState} from 'react';
import { Form, useActionData, useLoaderData,redirect} from 'react-router-dom';
export async function loader({ params }) {
    const eventId = params.id;
    try {
        const response = await fetch(`https://alimurtazaathar.pythonanywhere.com/api/events/${eventId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch event data');
        }
        const data = await response.json();
        return data; 
    } catch (error) {
        console.log(error.message);
        return { error: 'Failed to load event data' }; // Return an error object
    }
}



export const action = async ({ request }) => {
    const formData = new URLSearchParams(await request.formData());
    
    // Send data to your backend API
    const response = await fetch('https://alimurtazaathar.pythonanywhere.com/api/bookings', {
      method: 'POST',
      body: formData,
    });
  
    const data = await response.json();
  
    if (response.ok) {
        throw redirect('/members')
      return  {message:data.message}
    } else {
      return { error: data.error }
    }
  };
  

const Booking = () => {
    const data = useLoaderData();
    const actionData=useActionData();
    const [message,setMessage]=useState("");
    useEffect(()=>{
        if (actionData) {
            if (actionData.message) {
              setMessage(actionData.message); // Success message
            }
            if (actionData.error) {
              setMessage(actionData.error); // Error message
            }
          }
    },[actionData])

    return (

        <div className='h-dvh w-full flex flex-col justify-center items-center'>
        <Form method="post"  className="bg-white lg:w-[35%] w-[80%] h-[60%] rounded-2xl flex flex-col items-center justify-evenly animate-open">
    <input type="hidden" name="event_id" value={data.event_id} />
    <label htmlFor="name" className="text-black">Name:</label>
    <input name="name" type="text" required className="bg-gray-300 rounded-lg" />
    <label htmlFor="batch" className="text-black">Batch:</label>
    <input name="batch" type="text" required className="bg-gray-300 rounded-lg" />
    <label htmlFor="email" className="text-black">Email:</label>
    <input name="email" type="email" required className="bg-gray-300 rounded-lg" />
    <label htmlFor="roll" className="text-black">Roll Number:</label>
    <input name="roll" type="email" required className="bg-gray-300 rounded-lg" />
    <label htmlFor="number" className="text-black">Phone:</label>
    <input name="number" type="text" required className="bg-gray-300 rounded-lg" />
    <label htmlFor="transCode" className="text-black">Transaction Code:</label>
    <input name="transCode" type="text" required className="bg-gray-300 rounded-lg" />
    
    <button className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]' type='submit'>Book</button>
       
</Form>
        {message && <div className='text-white'>{message}</div>}
</div>

    );
}

export default Booking;
