import React,{useState} from 'react'
import Attendies from './Attendies';
import { useLoaderData } from 'react-router-dom';

export async function loader()
{

    
      try {
        const [members, meetings] = await Promise.all([
          fetch('http://127.0.0.1:5001/api/fetch_members'),
          fetch('http://127.0.0.1:5001/api/get_meetings')
        ])
         
        if (!members.ok || !meetings.ok) {
          throw new Error("Failed to fetch data");
      }
      const membersResult = await members.json();
      const meetingsResults = await meetings.json();
      return {
        members:membersResult,
        meetings:meetingsResults,
      };
    }
        catch(error){
          console.log(error.message);
          return null;
        }






}

const Attendance = () => {
    
    const {members,meetings}=useLoaderData();
    console.log(members);
    console.log(meetings);
    
  const [attendance, setAttendance] = useState(
        members?.map((member) => ({ ...member, attended: "-" })) || []
    );
    const handleSubmit = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5001/api/add_attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              meeting_id: 3, // Example meeting ID
              attendance: attendance,
            }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to save attendance');
          }
          alert('Attendance updated successfully!');
        } catch (error) {
          console.error('Error updating attendance:', error);
          alert('Failed to update attendance');
        }
      };
    const handleInputChange = (roll_number,value) => {
        setAttendance((prev) =>
            prev.map((member) =>
                member.roll_number === roll_number
                    ? { ...member, attended: value }
                    : member
            )
        );
    };
  return (
    <div className='w-full'> 
        <Attendies members={attendance}  handleInputChange={handleInputChange}/>
                 
        <button type="submit" onClick={handleSubmit} className='text-white bg-red-700 rounded-lg p-2 lg:p-3 ' >Save</button>
    </div>
  )
}

export default Attendance