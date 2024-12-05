import React, { useState, useEffect } from "react";
import { Form, useLoaderData, useActionData, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export async function loader() {
  try {
    const [toggleStatusResponse, fetchExcomResponse] = await Promise.all([
      fetch("http://127.0.0.1:5001/api/toggle_status"),
      fetch("http://127.0.0.1:5001/api/fetch_excom"),
    ]);

    if (!toggleStatusResponse.ok || !fetchExcomResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const toggleStatusData = await toggleStatusResponse.json();
    const fetchExcomData = await fetchExcomResponse.json();

    return {
      toggleStatus: toggleStatusData || null,
      excoms: fetchExcomData || [],
    };
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export const action = async ({ request }) => {
  const formData = new URLSearchParams(await request.formData());
  const response = await fetch("http://127.0.0.1:5001/api/register_induction", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (response.ok) {
    return { message: data.message };
  } else {
    console.log(data.message);
    return { error: data.error };
  }
};

const Team = () => {
  const data = useLoaderData();
  const actionData = useActionData();
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleStatus = data?.toggleStatus || { islive: 0 };
  const excoms = data?.excoms || [];
  const { islive } = toggleStatus;

  useEffect(() => {
    if (actionData?.error) {
      toast({
        title: "Submission Failed",
        description: actionData.error,
        variant: "destructive",
        action: <ToastAction altText="Retry">Retry</ToastAction>,
      });
    } else if (actionData?.message) {
      toast({
        title: "Submission Successful",
        description: "Stay Tuned!",
        action: <ToastAction altText="Dismiss" onClick={() => navigate('/')}>Ok</ToastAction>,
      });
      setIsSubmissionSuccessful(true);
    }
  }, [actionData, toast, navigate]);

  const headings = () => {
    if (islive === 0 && excoms.length === 0) {
      return "Inductions have not opened yet";
    } else if (islive === 1) {
      return "Apply Now";
    } else if (excoms.length > 0) {
      return "Presenting Excom 2024";
    }
  };

  return (
    <div className='h-dvh w-full flex justify-center items-center'>
      <div className='bg-white lg:w-[35%] w-[80%] p-10 rounded-2xl flex flex-col items-center justify-evenly animate-open'> 
        <h1 className='text-black lg:text-4xl text-2xl font-bold'>{headings()}</h1>
        
        {islive ? (
          <Form method="post" className="w-[90%] flex flex-col justify-evenly items-center gap-4">
            <Input 
              name="name" 
              placeholder="Full Name" 
              className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'
              required
            />
            <Input 
              name="rollno" 
              placeholder="22k-4297" 
              className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'
              required
            />
            <Select name="batch" required>
              <SelectTrigger className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'>
                <SelectValue placeholder="Select Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Freshie">Freshie</SelectItem>
                <SelectItem value="Sophomore">Sophomore</SelectItem>
                <SelectItem value="Junior">Junior</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              name="department" 
              placeholder="Department e.g: BsCs" 
              className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'
              required
            />
            <Input 
              name="email" 
              type="email"
              placeholder="Email Address" 
              className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'
              required
            />
            <Select name="position" required>
              <SelectTrigger className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'>
                <SelectValue placeholder="Select Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="President">President</SelectItem>
                <SelectItem value="Vice President">Vice President</SelectItem>
                <SelectItem value="Treasurer">Treasurer</SelectItem>
                <SelectItem value="Secretary">Secretary</SelectItem>
                <SelectItem value="General Secretary">General Secretary</SelectItem>
                <SelectItem value="Event Manager">Event Manager</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              name="past_experience" 
              placeholder="Tell us about your past experiences" 
              className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'
              required
            />
            <Input 
              name="motivation" 
              placeholder="What are your motivations?" 
              className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2'
              required
            />
            <Button type="submit" className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]'>
              Submit Application
            </Button>
          </Form>
        ) : (
          excoms.length > 0 && (
            <div className="w-full overflow-x-auto">
              <Table className="w-full">
                <TableCaption className="text-red-600 font-semibold">Excom 2024</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-red-600">Name</TableHead>
                    <TableHead className="text-red-600">Roll Number</TableHead>
                    <TableHead className="text-red-600">Position</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {excoms.map((excom) => (
                    <TableRow key={excom.roll_number} className="hover:bg-red-50">
                      <TableCell className="font-medium">{excom.name}</TableCell>
                      <TableCell>{excom.roll_number}</TableCell>
                      
                      <TableCell><Badge variant={"outline"}>{excom.position} </Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Team;

