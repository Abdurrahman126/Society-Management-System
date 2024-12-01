import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate ,Form,redirect, useActionData} from 'react-router-dom'
import { loggedIn } from './loginSlice';

export const action = async ({ request }) => {
  const formData = new URLSearchParams(await request.formData());
  const roll=formData.get('rollno');
  const pass=formData.get('password');
  const response = await fetch('https://alimurtazaathar.pythonanywhere.com/api/login', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (response.ok) {
    return {roll_no:roll,password:pass,success:"true"};
    console.log("HELLO",formData.get('password'))
  } else {
    return { error: data.error }
  }
};

const Login = () => {

  const navigate=useNavigate();
  const actionData=useActionData();
  console.log(actionData)
  const dispatch=useDispatch()
  if (actionData?.success) {
    dispatch(loggedIn({ roll: actionData.roll_no, pass: actionData.password }));
    navigate('/members');
  }
  

  return (
    <div className='h-dvh w-full flex justify-center items-center'>
        <div className='bg-white lg:w-[35%] w-[80%] h-[60%] rounded-2xl flex flex-col items-center justify-evenly animate-open'> 
        <h1 className='text-black lg:text-4xl text-2xl font-bold'>Sign In</h1>
          <Form method='post' className="w-[90%] flex flex-col justify-evenly items-center gap-4">
          <input name="rollno" placeholder='22k-4297' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
          <input name="password" type="password" placeholder='Password'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
          <button className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]'>Proceed</button>
          </Form>
          <p className='text-black text-opacity-60 text-xs lg:text-base'>Don't have an account?  <span className='text-red-600 cursor-pointer' onClick={()=>{
            navigate('/register')
          }}>Sign up now!</span></p>
       
        </div>
    </div>
  )
}

export default Login