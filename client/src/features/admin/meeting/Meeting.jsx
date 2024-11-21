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
import { Form } from 'react-router-dom'
export async function action(){

}


const Meeting = () => {
  return (
    <div>

        <h1 className='text-white'>Meeting channel</h1>
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
          <input name="title" type="text" placeholder='Monthly Meeting'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
          <input name="purpose" type="text" placeholder='Discussion about upcomming event'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
          <input name="venue" type="text" placeholder='EE A4'  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
          <input name="date" type="date"  className='text-xs  lg:text-base text-black border-black border-2 rounded-lg p-2 w-[90%] lg:w-[70%] mb-8'/>
          
          
          <DialogClose asChild>
          <Button type="submit">Save changes</Button>
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