
import React from 'react'
import DataTable from './DataTable';

import { useLoaderData,Form } from "react-router-dom";



    export async function loader()
{

    try {
      const [isOn, applicants] = await Promise.all([
        fetch('http://127.0.0.1:5001/api/toggle_status'),
        fetch('http://127.0.0.1:5001/api/applicants')
      ])
       
      if (!isOn.ok || !applicants.ok) {
        throw new Error("Failed to fetch data");
    }
    const isOnResult = await isOn.json();
    const applicantsResults = await applicants.json();
    return {
      isOn:isOnResult,
      applicants:applicantsResults,
    };
  }
      catch(error){
        console.log(error.message);
        return null;
      }
}
export async function action({request}){
  const formData = new URLSearchParams(await request.formData());
  console.log("value in forn:",formData.get('new_status'))
  const response = await fetch('http://127.0.0.1:5001/api/toggle_induction', {
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
  const {isOn,applicants}=useLoaderData();
  console.log("from database isOn=",isOn.islive);
  let newOn=0;
  if(isOn.islive===0){
    newOn=1;
  }
 
  // console.log(applicants)
  return (

      <div className='flex flex-col justify-center items-center'>
      <h1 className='text-white text-5xl'>Inductions are {!isOn.islive?"closed":"open"}</h1>
       <Form method="post">
       <input type="hidden" name="new_status" value={newOn} />
       <button className='bg-red-600 text-white lg:p-4 p-3 rounded-lg ' type="submit">{!isOn.islive?"Open":"Close"} inductions</button>
        </Form>
      { isOn.islive && <DataTable applicants={applicants} handleAccept={acceptInduction}/>}
        </div>
         
  )
}

export default Inductions