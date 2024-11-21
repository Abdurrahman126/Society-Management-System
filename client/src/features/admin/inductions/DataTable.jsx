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

import React from 'react'

const DataTable = ({applicants,handleAccept}) => {
    return (
        <div className="bg-white w-[70%] rounded-xl">
        <h1 className="text-white">Current Applicants</h1>
        <Table>
          <TableCaption>A list of the current inductions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>department</TableHead>
              <TableHead>Applied For</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Motivation</TableHead>
              <TableHead>Action</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.map((applicant) => (
              <TableRow key={applicant.roll_number}>
                <TableCell className="">{applicant.name}</TableCell>
                
                <TableCell className="">{applicant.roll_number}</TableCell>
                <TableCell>{applicant.batch}</TableCell>
                <TableCell>{applicant.department}</TableCell>
                <TableCell>{applicant.position}</TableCell>
                <TableCell>{applicant.past_experience}</TableCell>
                <TableCell>{applicant.motivation}</TableCell>
                <TableCell>   <button className="hover:bg-green-700 bg-green-200 p-4 rounded-xl" onClick={()=>{handleAccept(applicant)}}>Accept</button>
                  </TableCell>
          
              </TableRow>
            ))}
                
          </TableBody>
          <TableFooter>
           </TableFooter>
        </Table>
        </div>
      )
    
}

export default DataTable
