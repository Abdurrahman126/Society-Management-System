import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useNavigate,Form} from 'react-router-dom';
const MeetingCard = ({title,venue,purpose,date,id,tag}) => {
  return (
    <div className="mt-5 w-[95%] lg:w-[50%] flex flex-col">
    <Card className="border-none flex flex-col h-full bg-white bg-opacity-90">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{purpose}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className='font-medium'>Venue:{venue}</p>
        </CardContent>
        <CardContent className="flex-grow">
            <p className='font-medium'>Date:{date}</p>
        </CardContent>
       
        <CardFooter>
            <Form method="delete" >
            
            <input type="hidden" name="id" value={id}></input>
            <button className='text-white bg-red-700 rounded-lg p-2 lg:p-3 w-full'  type="submit" name="intent" value="delete">{!tag?"Join Now":tag}</button>
            </Form>
        </CardFooter>
    </Card>
</div>
  )
}

export default MeetingCard