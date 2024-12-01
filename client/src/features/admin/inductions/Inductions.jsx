
import React from 'react'
import DataTable from './DataTable';

import { useLoaderData,Form } from "react-router-dom";



    export async function loader()
{

    try {
      const [isOn, applicants,excom] = await Promise.all([
        fetch('https://alimurtazaathar.pythonanywhere.com/api/toggle_status'),
        fetch('https://alimurtazaathar.pythonanywhere.com/api/applicants'),
        fetch('https://alimurtazaathar.pythonanywhere.com/api/fetch_excom')
      ])
       
      if (!isOn.ok || !applicants.ok||!excom.ok) {
        throw new Error("Failed to fetch data");
    }
    const isOnResult = await isOn.json();
    const applicantsResults = await applicants.json();
    const excomResults = await excom.json();
    
    return {
      isOn:isOnResult,
      applicants:applicantsResults,
      excom:excomResults,
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
  const response = await fetch('https://alimurtazaathar.pythonanywhere.com/api/toggle_induction', {
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
    const response = await fetch("https://alimurtazaathar.pythonanywhere.com/api/appoint_excom", {
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
  const data = useLoaderData();

  // Safely extract data or provide default values
  const isOn = data?.isOn || { islive: 0 }; // Default to closed if `isOn` is undefined
  const applicants = data?.applicants || []; // Default to an empty array
  const excom = data?.excom || []; // Default to an empty array

  let newOn = isOn.islive === 0 ? 1 : 0;

  return (
    <div className="flex flex-col justify-center items-center">
      {/* Render the button regardless of data */}
      <h1 className="text-white text-5xl">
        Inductions are {isOn.islive ? "open" : "closed"}
      </h1>
      <Form method="post">
        <input type="hidden" name="new_status" value={newOn} />
        <button
          className="bg-red-600 text-white lg:p-4 p-3 rounded-lg"
          type="submit"
        >
          {isOn.islive ? "Close" : "Open"} inductions
        </button>
      </Form>
      {/* Conditionally render DataTable if data is available */}
      {isOn.islive && excom.length > 0 && (
        <DataTable
          excom={excom}
          applicants={applicants}
          handleAccept={acceptInduction}
        />
      )}
    </div>
  );
};

export default Inductions;