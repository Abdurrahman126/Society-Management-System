import React from 'react'
import { Form ,redirect, useSubmit} from 'react-router-dom'

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

export async function action({request}){
    console.log("im here")
    const formData = new URLSearchParams(await request.formData());
    const intent=formData.get('intent');
    if(intent==="admin"){
        const response = await fetch('http://127.0.0.1:5001/api/abbu_admin', {
            method: 'POST',
            body: formData,
          });
        
          const data = await response.json();
        
          if (response.ok) {
              throw redirect('/admin')
            return  {message:data.message}
          } else {
            return { error: data.error }
          }    
      

    }
    else if(intent==="excom"){
        const response = await fetch('http://127.0.0.1:5001/api/signin_admin', {
            method: 'POST',
            body: formData,
          });
        
          const data = await response.json();
        
          if (response.ok) {
              throw redirect('/admin')
            return  {message:data.message}
          } else {
            return { error: data.error }
          }
    }


}


const AdminLogin = () => {
  const submit=useSubmit();
  return (
    <div className='h-dvh w-full flex justify-center items-center'>
        <div className='bg-white lg:w-[35%] w-[80%] h-[60%] rounded-2xl flex flex-col items-center justify-evenly animate-open'> 
        <h1 className='text-black lg:text-4xl text-2xl font-bold'>Sign In</h1>
            
<Dialog>
      <DialogTrigger asChild>
    
      <button className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]' type="submit" name="intent" value="excom">Proceed as Excom admin</button>

      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Details</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <Form method='post' className="w-[90%] flex flex-col justify-evenly items-center gap-4">
        <label htmlFor='email'>email</label>
         
          <Input name="email" placeholder='admin@fast,com' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
          <label htmlFor='password'>Password</label>
          <Input name="password"  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
          <label htmlFor='secret_key'>secret key</label>
         
          <Input name="secret_key"  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
          
          <DialogClose asChild>
          <Button type="submit" name="intent" value="admin">Save changes</Button>
          </DialogClose>
          </Form>
          
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>


    <Dialog>
      <DialogTrigger asChild>
    
      <button className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]' >Proceed as Excom admin</button>

      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Details</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <Form method='post' className="w-[90%] flex flex-col justify-evenly items-center gap-4">
        <label htmlFor='email'>Email</label>
        
          <Input name="email" placeholder='admin@fast,com' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
          <label htmlFor='password'>Password</label>
        
          <Input name="password"  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
          
          <DialogClose asChild>
          <Button type="submit" name="intent" value="excom" >Save changes</Button>
          </DialogClose>
          </Form>
          
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
   
        </div>
    </div>
 
  )
}

export default AdminLogin