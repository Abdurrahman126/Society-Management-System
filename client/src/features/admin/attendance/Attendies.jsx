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

const Attendies = ({ members, handleInputChange, isSubmitted }) => {
  return (
    <div className="bg-white w-[70%] rounded-xl">
      <h1 className="text-white">Current Applicants</h1>
      <Table className="p-16">
        <TableCaption>Team Decs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Roll Number</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.roll_number}>
              <TableCell>{member.roll_number}</TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>
                {member.recordFound ? (
                  <span className="text-black">{member.attended}</span>
                ) : isSubmitted ? (
                  <span className="text-black">{member.attended}</span>
                ) : (
                  <select
                    onChange={(e) =>
                      handleInputChange(member.roll_number, e.target.value)
                    }
                    value={member.attended}
                    required
                    className="text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2"
                  >
                    <option value="-" defaultValue={"-"}>-</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </div>
  );
};

export default Attendies;
