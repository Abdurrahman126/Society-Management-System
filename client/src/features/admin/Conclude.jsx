import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { IoIosWarning } from "react-icons/io";

// Conclude Component
const Conclude = () => {
  // Function to handle the Erase button click
  const handleEraseClick = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/reset_database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Database reset successfully.");
      } else {
        alert(data.error || "An error occurred while resetting the database.");
      }
    } catch (error) {
      alert("An error occurred while resetting the database.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className="border-none flex flex-col bg-white bg-opacity-90 w-[20%] aspect-square cursor-pointer hover:scale-105 hover:ease-in transition-all"
        >
          <CardHeader>
            <CardTitle>
              <IoIosWarning className='text-red-600 text-5xl' />
            </CardTitle>
          </CardHeader>
          <CardFooter>
            <h1 className='text-3xl m-0 ml-auto self-center font-medium'>Session Conclusion</h1>
          </CardFooter>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Erase all data?</DialogTitle>
          <DialogDescription>
            This action will erase all data in the database. Are you sure you want to proceed?
          </DialogDescription>
        </DialogHeader>
        
        <DialogClose asChild>
          <Button
            type="button"
            onClick={handleEraseClick}  // Trigger the API call on click
          >
            Erase
          </Button>
        </DialogClose>

        <DialogFooter>
          {/* Footer content if necessary */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Conclude;
