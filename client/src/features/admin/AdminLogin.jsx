import React from 'react'
import { Form ,redirect} from 'react-router-dom'

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
  return (
    <div className='h-dvh w-full flex justify-center items-center'>
        <div className='bg-white lg:w-[35%] w-[80%] h-[60%] rounded-2xl flex flex-col items-center justify-evenly animate-open'> 
        <h1 className='text-black lg:text-4xl text-2xl font-bold'>Sign In</h1>
          <Form method='post' onSubmit={()=>{console.log("im submitting")}} className="w-[90%] flex flex-col justify-evenly items-center gap-4">
          <input name="email" placeholder='admin@fast.com' type="email" className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
          <input name="password" type="password" placeholder='Password'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
          <Dialog as child>
          <DialogTrigger asChild>
         
            <Button variant="outline" className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]'>Sign in as Admin</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enter Secret key</DialogTitle>
              {/* <DialogDescription>
               Password shall be sent using email(maybe)
              </DialogDescription> */}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="secret_key" className="text-right">
                  Password
                </Label>   
                <input type="hidden" name="email"
                />
                <input type="hidden" name="password"
                />
                
                <input name="secret_key" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
            <DialogClose >
              <button name="intent" type="submit" value="admin">Done</button>
           </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
          
          
          <span className='text-gray-500'>or</span>
          <button className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]' type="submit" name="intent" value="excom">Proceed as Excom admin</button>
        
          </Form>
          {/* <p className='text-black text-opacity-60 text-xs lg:text-base'>Don't have an account?  <span className='text-red-600 cursor-pointer' onClick={()=>{
            navigate('/register')
          }}>Sign up now!</span></p>
        */}
        </div>
    </div>
 
  )
}

export default AdminLogin