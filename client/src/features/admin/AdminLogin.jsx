import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loggedIn, selectEmail } from './adminAuthSlice'; // Assuming the path to the slice is correct
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('excom');
  const email=useSelector(selectEmail)


  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    const apiUrl = loginType === 'admin' 
      ? 'http://127.0.0.1:5001/api/abbu_admin' 
      : 'http://127.0.0.1:5001/api/signin_admin';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("dispatching")
        dispatch(loggedIn({ email, password }));
        navigate('/admin');
        console.log("dispatched")

      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className='h-dvh w-full flex justify-center items-center '>
      <div className='bg-white lg:w-[35%] w-[80%] h-[60%] rounded-2xl flex flex-col items-center justify-evenly animate-open '> 
        <h1 className='text-black lg:text-4xl text-2xl font-bold'>Sign In</h1>
        
        <form onSubmit={handleSubmit} className="w-[90%] flex flex-col justify-evenly items-center gap-4">
          <Input 
            name="email" 
            type="email"
            placeholder='admin@fast.com' 
            className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'
            required
          />
          <Input 
            name="password" 
            type="password"
            placeholder="Password"
            className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%]'
            required
          />
          {loginType === 'admin' && (
            <Input 
              name="secret_key" 
              type="password"
              placeholder="Secret Key"
              className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%]'
              required
            />
          )}
          <RadioGroup 
            defaultValue="excom" 
            onValueChange={setLoginType}
            className="flex justify-center space-x-4 w-full"
          >
            <div className="flex items-center">
              <RadioGroupItem value="excom" id="excom" />
              <Label htmlFor="excom" className="ml-2">Excom Admin</Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="admin" id="admin" />
              <Label htmlFor="admin" className="ml-2">Admin</Label>
            </div>
          </RadioGroup>
          <Button type="submit" className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]'>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

