import React, { useState, useEffect } from "react";
import Attendies from "./Attendies";
import { useLoaderData } from "react-router-dom";

export async function loader() {
  try {
    const [members, meetings] = await Promise.all([
      fetch("https://alimurtazaathar.pythonanywhere.com/api/fetch_members"),
      fetch("https://alimurtazaathar.pythonanywhere.com/api/get_meetings"),
    ]);

    if (!members.ok || !meetings.ok) {
      throw new Error("Failed to fetch data");
    }

    const membersResult = await members.json();
    const meetingsResults = await meetings.json();
    return {
      members: membersResult,
      meetings: meetingsResults,
    };
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

const Attendance = () => {
  const { members, meetings } = useLoaderData();
  const [attendance, setAttendance] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState(
    meetings[0]?.meeting_id || null
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(
          `https://alimurtazaathar.pythonanywhere.com/api/fetch_attendance/${selectedMeetingId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch attendance records");
        }

        const attendanceData = await response.json();

        const updatedAttendance = members.map((member) => {
          const record = attendanceData.attendance_records.find(
            (a) => a.member_id === member.roll_number
          );

          return {
            ...member,
            attended:
              record?.attendance === 1
                ? "present"
                : record?.attendance === 0
                ? "absent"
                : "-",
            recordFound: record !== undefined, // True if record exists
          };
        });

        setAttendance(updatedAttendance);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setAttendance(
          members.map((member) => ({
            ...member,
            attended: "-",
            recordFound: false, // False if no record exists
          }))
        );
      }
    };

    if (selectedMeetingId) {
      fetchAttendance();
    }
  }, [selectedMeetingId, members]);

  const handleMeetingChange = (event) => {
    setSelectedMeetingId(event.target.value);
  };

  const handleInputChange = (roll_number, value) => {
    setAttendance((prev) =>
      prev.map((member) =>
        member.roll_number === roll_number
          ? { ...member, attended: value }
          : member
      )
    );
  };

  const handleSubmit = async () => {
    // Validate that no attendance value is "-"
    const isValid = attendance.every(
      (member) => member.attended !== "-"
    );

    if (!isValid) {
      setErrorMessage("Please mark attendance for all members.");
      return;
    }

    setErrorMessage(""); // Clear any previous error message

    try {
      const formattedAttendance = attendance.map((member) => ({
        roll_number: member.roll_number,
        attended: member.attended === "present" ? 1 : 0,
      }));

      const response = await fetch("https://alimurtazaathar.pythonanywhere.com/api/add_attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meeting_id: selectedMeetingId,
          attendance: formattedAttendance,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save attendance");
      }

      setIsSubmitted(true); // Set submission flag to true after successful save
      alert("Attendance updated successfully!");
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance");
    }
  };

  // Check if all members have records found
  const allRecordsFound = attendance.every((member) => member.recordFound);

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block mb-2 font-bold text-gray-700">
          Select Meeting
        </label>
        <select
          value={selectedMeetingId}
          onChange={handleMeetingChange}
          className="border border-gray-300 rounded-lg p-2"
          disabled={isSubmitted} // Disable if submitted
        >
          {meetings.map((meeting) => (
            <option key={meeting.meeting_id} value={meeting.meeting_id}>
              {meeting.title || `Meeting ${meeting.meeting_id}`}
            </option>
          ))}
        </select>
      </div>
      <Attendies members={attendance} handleInputChange={handleInputChange} isSubmitted={isSubmitted} />
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
      {!allRecordsFound && !isSubmitted && ( // Show save button only if not submitted
        <button
          type="submit"
          onClick={handleSubmit}
          className="text-white bg-red-700 rounded-lg p-2 lg:p-3"
        >
          Save
        </button>
      )}
    </div>
  );
};

export default Attendance;
