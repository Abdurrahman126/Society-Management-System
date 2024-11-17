import React from 'react'
import { Form } from 'react-router-dom'

const Register = () => {
  return (
    <div className='pt-20 w-full flex justify-center items-center'>
    <div className='bg-white lg:w-[35%] w-[80%] h-[60%] rounded-2xl flex flex-col items-center justify-evenly animate-open py-4'> 
    <h1 className='text-black lg:text-4xl text-2xl font-bold'>Member Induction</h1>
  
    <Form className='w-[90%] flex flex-col justify-evenly items-center gap-4'>
     <input name="email" placeholder='Full Name' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
     <input name="email" placeholder='Batch e.g:22k' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
     
     <input name="email" placeholder='Department e.g:BsCs' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
     <input name="email" placeholder='Section' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
         
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
      <button className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]'>Proceed</button>
      </Form>
   
    </div>
</div>
  )
}

export default Register