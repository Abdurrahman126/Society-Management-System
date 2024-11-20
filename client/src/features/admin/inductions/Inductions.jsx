
import React from 'react'
import DataTable from './DataTable';

import { useLoaderData } from "react-router-dom";



    export async function loader()
{

    try {
        const response = await fetch('http://127.0.0.1:5001/api/applicants'); 
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


const acceptInduction = async (applicant) => {
  try {
    const response = await fetch("http://127.0.0.1:5001/api/appoint_excom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: applicant.email }),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(`Error: ${error.message}`);
      return;
    }

    const data = await response.json();
    alert(`Success: ${data.message}`);
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while appointing the applicant.");
  }
};


const Inductions = () => {
  const applicants=useLoaderData();
  console.log(applicants)
  return (

      <div className='flex justify-center items-center'>
        {/* <h1 className='text-white text-5xl'>Inductions are not open</h1>
        <button className='bg-red-600 text-white lg:p-4 p-3 rounded-lg '>Open inductions</button> */}
       <DataTable applicants={applicants} handleAccept={acceptInduction}/>
        </div>
         
  )
}

export default Inductions