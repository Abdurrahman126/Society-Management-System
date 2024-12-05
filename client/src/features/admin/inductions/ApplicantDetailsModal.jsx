import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const ApplicantDetailsModal = ({ isOpen, onClose, applicant }) => {
  if (!applicant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{applicant.name}</DialogTitle>
          <DialogDescription>Applicant Details</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Roll Number</h4>
              <p>{applicant.roll_number}</p>
            </div>
            <div>
              <h4 className="font-semibold">Batch</h4>
              <p>{applicant.batch}</p>
            </div>
            <div>
              <h4 className="font-semibold">Department</h4>
              <p>{applicant.department}</p>
            </div>
            <div>
              <h4 className="font-semibold">Applied For</h4>
              <p>{applicant.position}</p>
            </div>
            <div>
              <h4 className="font-semibold">Experience</h4>
              <p>{applicant.past_experience}</p>
            </div>
            <div>
              <h4 className="font-semibold">Motivation</h4>
              <p>{applicant.motivation}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantDetailsModal;

