
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


const AttendanceTable = ({attendance}) => {
  return (
    <div className="bg-white w-[70%] rounded-xl">
        <Table>
    <TableCaption>Attendance</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead >Meeting Title</TableHead>
        <TableHead>Meeting Date</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {attendance.map((data) => (
        <TableRow key={data.meeting_id}>
          <TableCell>{data.meeting_title}</TableCell>
          <TableCell>{data.meeting_date}</TableCell>
          <TableCell>
           {data.attendance_status}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
    <TableFooter></TableFooter>
  </Table>
</div>
  )
}

export default AttendanceTable