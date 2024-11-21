
import React, { useEffect } from 'react'
//this is redundant we will delete it later
import Events from '@/components/Events';
import { useLoaderData,Form } from 'react-router-dom';
import { FaPlus, } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

export async function loader()
{

    try {
        const response = await fetch('http://127.0.0.1:5001/api/events'); 
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        return data;
      }
      catch(error){
        console.log(error.message);
        return null;
      }
}
export const action = async ({ request }) => {
  const formData = new URLSearchParams(await request.formData());
  const intent=formData.get("intent")
 
  if(intent==="post"){
    const response = await fetch('http://127.0.0.1:5001/api/add_event', {
      method: 'POST',
      body: formData,
    });
    const postdata = await response.json();
  
    if (response.ok) {
      return  {message:postdata.message}
    } else {
      console.log(postdata.message)
      return { error: postdata.error }
    }
  }
  else if(intent==="delete"){
    const id=formData.get('id');
    const response = await fetch(`http://127.0.0.1:5001/api/delete_event/${id}`, {
      method: 'delete',
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return  {message:data.message}
  

     } else {
      console.log(data.message)
      return { error: data.error }
    }
    
  }
  
};

const EventsHandler = () => {

  const array=useLoaderData();
  const events=array.map((item)=>{
    return(
    <Events key={item.event_id} id={item.event_id} name={item.event_title}
    description={item.about_event} eventOn={item.event_date}  tag="Delete Event"/>
    )
})



  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
        <h1 className='text-white text-3xl'>Events Live</h1>
        <div className='flex justify-evenly items-stretch flex-wrap gap-y-5'>
    {events}
    
<Dialog>
      <DialogTrigger asChild>
      <Card className="border-none flex flex-col justify-center items-center  bg-white bg-opacity-90 w-[20%] aspect-square cursor-pointer  " 
            >
                  <CardHeader>
                      <CardTitle className="flex justify-center items-center">
                        <FaPlus className=' border-gray-500 rounded-3xl p-2 bg-gray-500 text-5xl  hover:scale-105 hover:ease-in transition-all'/>
          
                      </CardTitle>
                      <CardFooter>
                        Add Event
                      </CardFooter>
                  </CardHeader>
              </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Details</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <Form method='post' className="w-[90%] flex flex-col justify-evenly items-center gap-4">
          <input name="event_title" placeholder='Annual Dinner' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
          <input name="about_event" type="text" placeholder='Please pass lelo'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
          <input name="venue" type="text" placeholder='Audi'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
          
          <input name="event_date" type="date" className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'/>
          <DialogClose asChild>
          <Button type="submit" name="intent" value="post">Save changes</Button>
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

export default EventsHandler


