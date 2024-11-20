import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useLoaderData } from 'react-router-dom';
import PassDialog from './PassDialog';
export async function loader()
{

  try {
    const response = await fetch('http://127.0.0.1:5001/api/fetch_excom'); 
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



  const Control = () => {


    const appointAsAdmin=(password)=>{
    


    }
    
    




    const excoms=useLoaderData();
  return (
    <div className='bg-white'>
       <Table>
          <TableCaption>A list of the current inductions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Action</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {excoms.map((excom) => (
              <TableRow key={excom.roll_number}>
                <TableCell className="">{excom.name}</TableCell>
                
                <TableCell className="">{excom.roll_number}</TableCell>
                <TableCell>{excom.email}</TableCell>
                <TableCell>{excom.position}</TableCell>
                <TableCell><PassDialog rollno={excom.roll_number}/> </TableCell>
          
              </TableRow>
            ))}
                
          </TableBody>
          <TableFooter>
           </TableFooter>
        </Table>
    </div>
  )
}

export default Control