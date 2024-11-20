


import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import React,{useRef} from 'react'

const PassDialog = ({rollno}) => {

    const passwordRef = useRef(null);
    const addAsAdmin = async (rollno,password) => {
        try {
          const response = await fetch("http://127.0.0.1:5001/api/add_admin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ rollno:rollno,password:password }),
          });
    
          if (response.ok) {
            const data = await response.json();
            alert(data.message); // Handle success
          } else {
            const errorData = await response.json();
            alert(errorData.message); // Handle error
          }
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred while updating the admin.");
        }
      };

      const handleSubmit = () => {
        const password = passwordRef.current.value; 
        addAsAdmin(rollno, password); 
    };
    

    return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add as Admin</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enter Admin Password</DialogTitle>
              <DialogDescription>
               Password shall be sent using email(maybe)
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input id="password" className="col-span-3" ref={passwordRef}/>
              </div>
            </div>
            <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={handleSubmit}>Save changes</Button>
           </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
}

export default PassDialog
