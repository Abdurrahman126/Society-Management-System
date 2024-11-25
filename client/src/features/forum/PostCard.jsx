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



const postCard = ({id,content,email,likes,time,handler,btn}) => {
  return (
    <div className="mt-5 w-[95%] lg:w-[50%] flex flex-col">
   
    <Card className="border-none flex flex-col h-full bg-white bg-opacity-90">
        <CardHeader>

            <CardTitle>{email}</CardTitle>
            <CardDescription>{time}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className='font-medium'>{content}</p>
        </CardContent>
       
        <CardFooter>
     {!btn &&   <form method="POST" onSubmit={handler}>
            <input type="hidden" name="id" value={id}/>
         <button className='bg-red-300 rounded-md p-2' type="submit" >Like</button>
</form>}
            
            <span>{btn?`Likes${likes}"`:likes}</span>
        </CardFooter>
    </Card>
    {btn && <button className=' z-10  right-2 bg-red-500' onClick={()=>{handler(id)}}>X</button> }
  
</div>
  )
}

export default postCard