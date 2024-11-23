import React from 'react'
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
  import { FaPlus, } from "react-icons/fa";
import { Form ,useLoaderData} from 'react-router-dom'
import MeetingCard from '@/components/MeetingCard'

export const action = async ({ request }) => {
  const formData = new URLSearchParams(await request.formData());
  const intent=formData.get("intent")
 
  if(intent==="post"){
    const response = await fetch('http://127.0.0.1:5001/api/add_meeting', {
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
    const response = await fetch(`http://127.0.0.1:5001/api/delete_meeting/${id}`, {
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
  return null;
};
export async function loader()
{

    try {
        const response = await fetch('http://127.0.0.1:5001/api/get_meetings'); 
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

const Meeting = () => {

  const array=useLoaderData();
  const meetings=array.map((item)=>{
    return(
  
    <MeetingCard key={item.meeting_id} id={item.meeting_id} title={item.title}
    purpose={item.purpose} venue={item.venue} date={item.meeting_date}  tag="Delete Meeting"/>
    )
})


  return (
    <div>
        <h1 className='text-white'>Meeting channel</h1>
      
        {meetings}
        <Dialog>
      <DialogTrigger asChild>
      <Card className="border-none flex flex-col justify-center items-center  bg-white bg-opacity-90 w-[20%] aspect-square cursor-pointer  " 
            >
                  <CardHeader>
                      <CardTitle className="flex justify-center items-center">
                        <FaPlus className=' border-gray-500 rounded-3xl p-2 bg-gray-500 text-5xl  hover:scale-105 hover:ease-in transition-all'/>
          
                      </CardTitle>
                      <CardFooter>
                        Add Meeting
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
          <input name="meeting_title" type="text" placeholder='Monthly Meeting'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
          <input name="purpose" type="text" placeholder='Discussion about upcomming event'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
          <input name="venue" type="text" placeholder='EE A4'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
          <input name="date" type="date"  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
          
          
          <DialogClose asChild>
          <Button type="submit" name="intent" value="post">Save changes</Button>
          </DialogClose>
          </Form>
          
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>



    </div>
  )
}

export default Meeting