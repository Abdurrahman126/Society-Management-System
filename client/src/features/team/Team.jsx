import React from 'react'
import { Form } from 'react-router-dom'

export const action = async ({ request }) => {
    const formData = new URLSearchParams(await request.formData());
    //add applicants link here
    const response = await fetch('', {
      method: 'POST',
      body: formData,
    });
  
    const data = await response.json();
  
    if (response.ok) {
        throw redirect('/members')
      return  {message:data.message}
    } else {
      console.log(data.message)
      return { error: data.error }
    }
  };
  

const Team = () => {
  return (
    <div className='flex justify-center items-center h-full'>
         <div className='bg-white lg:w-[35%] w-[80%] h-[60%] rounded-2xl flex flex-col items-center justify-evenly animate-open py-4'> 
    <h1 className='text-black lg:text-4xl text-2xl font-bold'>Apply Now</h1>
  <Form method="post" className='w-[90%] flex flex-col justify-evenly items-center gap-4'>
     <input name="name" placeholder='Full Name' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
     <input name="batch" placeholder='Batch e.g:22k' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
     
     <input name="department" placeholder='Department e.g:BsCs' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
     <input name="section" placeholder='Section' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
         
      <input name="email" placeholder='Email Address' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
      
      <label htmlFor="position" className='mr-auto opacity-70'>Choose Position</label>
      <select
          name="team"
          id="team"
          required
          className="text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2"
        >
          <option value="" disabled>Select your position</option>
          <option value="President">President</option>
          <option value="Vice President">Vice President</option>
          <option value="Treasurer">Treasurer</option>
          <option value="Secretary">Secretary</option>

          <option value="General Secretary">General Secretary</option>

          <option value="Event Manager">Event Manager</option>

        </select>
      <button className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]' type="submit">Proceed</button>
      </Form>
  

    </div>
    </div>

  )
}

export default Team