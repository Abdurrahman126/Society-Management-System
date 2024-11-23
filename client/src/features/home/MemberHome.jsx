import React from 'react'
import { useLocation,Form } from 'react-router-dom'


import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export async function action(){
  const formData = new URLSearchParams(await request.formData());
    
  // Send data to your backend API
  const response = await fetch('http://127.0.0.1:5001/api/change_password', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (response.ok) {
    return  {message:data.message}
  } else {
    return { error: data.error }
  }
}


const MemberHome = () => {
  // const location=useLocation();
  // const {password}=location.state;
  // console.log(password);
  const password="fast1234"
  const dialog=()=>{
    <Dialog open={true}> 
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Enter New Password</DialogTitle>
        <DialogDescription>
          <p>Using the default password could lead to security concerns</p>
        </DialogDescription>
      </DialogHeader>
      <Form method='post' className="w-[90%] flex flex-col justify-evenly items-center gap-4">
      <label htmlFor='password'>Password</label>
       
        <Input name="password"  className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
        
        <DialogClose asChild>
        <Button type="submit">Save changes</Button>
        </DialogClose>
        </Form>
        
      <DialogFooter>
      </DialogFooter>
    </DialogContent>
  </Dialog>


  }

  return (
    <div><h1 className='text-white'>MemberHome
    
    {password==="fast1234" && dialog()}
    
    </h1></div>
  )
}

export default MemberHome