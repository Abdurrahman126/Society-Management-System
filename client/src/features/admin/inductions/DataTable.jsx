import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, CheckCircle, Inbox } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import ApplicantDetailsModal from './ApplicantDetailsModal';

const DataTable = ({ applicants, handleAccept, excom }) => {
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const isEmpty = applicants.length === 0 && excom.length === 0;

  if (isEmpty) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-12 bg-white shadow-md rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4">
        <Inbox className="h-12 w-12 text-gray-400 animate-pulse" />
        <h2 className="text-xl font-semibold text-gray-700">No applications yet</h2>
        <p className="text-sm text-gray-500">Check back later to view submitted applications.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-md mt-10 overflow-hidden">
  <ScrollArea className="max-h-[600px] overflow-y-auto p-6">
    <Table className="min-w-[800px]">

          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px] text-red-600">Name</TableHead>
              <TableHead className="text-red-600">Roll Number</TableHead>
              <TableHead className="text-red-600">Batch</TableHead>
              <TableHead className="text-red-600">Department</TableHead>
              <TableHead className="text-red-600">Applied For</TableHead>
              <TableHead className="text-right text-red-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.map((applicant) => {
              const isAccepted = excom.some((member) => member.roll_number === applicant.roll_number);

              return (
                <TableRow key={applicant.roll_number}>
                  <TableCell className="font-medium">{applicant.name}</TableCell>
                  <TableCell>{applicant.roll_number}</TableCell>
                  <TableCell>{applicant.batch}</TableCell>
                  <TableCell>{applicant.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{applicant.position}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {isAccepted ? (
                      <span className="flex items-center justify-end text-green-600">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accepted
                      </span>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleAccept(applicant)}>
                            Accept applicant
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedApplicant(applicant)}>
                            View details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
      <ApplicantDetailsModal
        isOpen={!!selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        applicant={selectedApplicant}
      />
    </div>
  );
};

export default DataTable;
