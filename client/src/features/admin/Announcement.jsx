import React from 'react'
import { Form } from 'react-router-dom'

export const action = async ({ request }) => {
    const formData = new URLSearchParams(await request.formData());
    //place announcement url here 
    const response = await fetch('http://127.0.0.1:5001/api/add_announcements', {
      method: 'POST',
      body: formData,
    });
  
    const data = await response.json();
  
    if (response.ok) {
      return  {message:data.message}
    } else {
      return { error: data.error }
    }
  };
  

const Announcement = () => {
  return (
    <div>
        <h1 className='text-white'>Announcemnt List:</h1>
        <h2>Not done yet!</h2>
        <Form method='post' className="w-[90%] flex flex-col justify-evenly  gap-4">
          <input name="Heading" placeholder='Heading' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
          <input name="Description" type="text" placeholder='Description'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8 '/>
          <label htmlFor='date' className='text-white'>Add date</label>
          <input name="date" type="date" placeholder='Description'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8 '/>
          
          <button className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]'>Post Announcmenet</button>
          </Form>
          
    </div>
  )
}

export default Announcement