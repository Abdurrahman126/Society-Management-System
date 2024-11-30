import React from 'react'
import { Form ,redirect} from 'react-router-dom'


export const action = async ({ request }) => {


  






  const formData = new URLSearchParams(await request.formData());
  
  const response = await fetch('http://127.0.0.1:5001/api/register', {
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

const Register = () => {
  return (
    <div className='pt-20 w-full flex justify-center items-center'>
    <div className='bg-white lg:w-[35%] w-[80%] h-[60%] rounded-2xl flex flex-col items-center justify-evenly animate-open py-4'> 
    <h1 className='text-black lg:text-4xl text-2xl font-bold'>Member Induction</h1>
  
    <Form method="post" className='w-[90%] flex flex-col justify-evenly items-center gap-4'>
     <input name="name" placeholder='Full Name' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
      <select
          name="batch"
          id="batch"
          required
          className="text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2"
        >
          <option value="" disabled selected>Select your batch</option>
          <option value="Freshie">Freshie</option>
          <option value="Sophomore">Sophomore</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>

     
        </select>
    
    <input name="rollno" placeholder='22k-4297' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
     
     <input name="department" placeholder='Department e.g:BsCs' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
     <input name="section" placeholder='Section' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
         
      <input name="email" placeholder='Email Address' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
      <input name="password" type="password" placeholder='Password'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%]'/>
      <input name="confirm" type="password" placeholder='Confirm Password'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
      
      <label htmlFor="team" className='mr-auto opacity-70'>Choose Team</label>
    <input type="radio" name="team" value="MNP" /> 
  <label className="text-xs lg:text-base text-black">
  MNP
  </label>
    <input type="radio" name="team" value="Graphics" /> 
  <label className="text-xs lg:text-base text-black">
  Graphics
  </label>
    <input type="radio" name="team" value="Security" /> 
  <label className="text-xs lg:text-base text-black">
  Security
  </label>
    <input type="radio" name="team" value="General" /> 
  <label className="text-xs lg:text-base text-black  mb-8">
  General
  </label>
      <button className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]' type="submit">Proceed</button>
      </Form>
   
    </div>
</div>
  )
}

export default Register