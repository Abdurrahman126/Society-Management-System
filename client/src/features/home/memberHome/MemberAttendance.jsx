import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectRoll } from '../../login/loginSlice'; // Import your selector
import { useLoaderData,redirect } from 'react-router-dom';
import {checkAuth} from "./checkAuth.js"
import AttendanceTable from './AttendanceTable';
export async function loader({params}){


  const roll_number = params.roll_number;
  try {
      const response = await fetch(`http://127.0.0.1:5001/api/track_attendance/${roll_number}`);
      if (!response.ok) {
          throw new Error('Failed to fetch event data');
      }
      const data = await response.json();
      return data; 
  } catch (error) {
      console.log(error.message);
      return { error: 'Failed to load event data' }; // Return an error object
  }
}


const MemberAttendance = () => {
  const rollNumber = useSelector(selectRoll); // Get roll_number from Redux store
  const attendanceData=useLoaderData();
  const [error, setError] = useState(null);

  
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='pt-20'>
      {attendanceData ? (
        <div clas>
          <h1 className='text-white'>Attendance Data</h1>
        <AttendanceTable attendance={attendanceData.attendance_data}/>
        <h2 className='text-white text-4xl'>Attendance:{attendanceData.attendance_percentage}</h2>
        </div>
      ) : (
        <p>Loading attendance data...</p>
      )}
    </div>
  );
};

export default MemberAttendance;
