import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loggedIn } from './adminAuthSlice'; // Assuming the path to the slice is correct
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose ,DialogTrigger} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form } from 'react-router-dom';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event, intent) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.target);
    const email=formData.get('email');
    const pass=formData.get('password');
    
    const apiUrl = intent === 'admin' 
      ? 'http://alimurtazaathar.pythonanywhere.com/api/abbu_admin' 
      : 'http://alimurtazaathar.pythonanywhere.com/api/signin_admin'; // Different endpoints for Admin and Excom Admin

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      // Dispatch login data to Redux
      dispatch(loggedIn({ email, pass }));
      // Redirect after successful login
      navigate('/admin');
    } else {
      alert('Error: ' + data.error);
    }
  };

  return (
    <div className='h-dvh w-full flex justify-center items-center'>
      <div className='bg-white lg:w-[35%] w-[80%] h-[60%] rounded-2xl flex flex-col items-center justify-evenly animate-open'> 
        <h1 className='text-black lg:text-4xl text-2xl font-bold'>Sign In</h1>
        
        {/* Button for Excom admin login */}
        <Dialog>
          <DialogTrigger asChild>
            <button className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]' type="button">
              Proceed as Excom admin
            </button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enter Excom Details</DialogTitle>
            </DialogHeader>
            <form method='post' onSubmit={(e) => handleSubmit(e, 'excom')} className="w-[90%] flex flex-col justify-evenly items-center gap-4">
              <label htmlFor='email'>Email</label>
              <Input 
                name="email" 
                placeholder='excom@fast.com' 
                className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'
              />
              <label htmlFor='password'>Password</label>
              <Input 
                name="password" 
                className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'
              />
              <DialogClose asChild>
                <Button type="submit">Login as Excom Admin</Button>
              </DialogClose>
            </form>
          </DialogContent>
        </Dialog>

        {/* Button for Admin login */}
        <Dialog>
          <DialogTrigger asChild>
            <button className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]' type="button">
              Proceed as Admin
            </button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enter Admin Details</DialogTitle>
            </DialogHeader>
            <Form method='post' onSubmit={(e) => handleSubmit(e, 'admin')} className="w-[90%] flex flex-col justify-evenly items-center gap-4">
              <label htmlFor='email'>Email</label>
              <Input 
                name="email" 
                placeholder='admin@fast.com' 
                className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'
              />
              <label htmlFor='password'>Password</label>
              <Input 
                name="password" 
                className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'
              />
              <label htmlFor='secret_key'>Secret Key</label>
              <Input 
                name="secret_key" 
                className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'
              />
              <DialogClose asChild>
                <Button type="submit">Login as Admin</Button>
              </DialogClose>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminLogin;
