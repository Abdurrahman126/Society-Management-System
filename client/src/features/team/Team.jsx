import React, { useEffect, useState } from "react";
import { Form, useLoaderData, useActionData, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1, "Full Name is required."),
  rollno: z
    .string()
    .regex(/22k-\d{4}/, {
      message: "Roll number must be in the format: 22k-XXXX",
    }),
  email: z
    .string()
    .email("Invalid email address")
    .refine((val) => val.endsWith("@nu.edu.pk"), {
      message: "Email must end with @nu.edu.pk",
    }),
  past_experience: z.string().min(1, "Past Experience is required."),
  motivation: z.string().min(1, "Motivation is required."),
  department: z.string().min(1, "Department is required."),
  batch: z.string().min(1, "Batch is required."),
  position: z.string().min(1, "Position is required."),
});

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rollno: "",
      email: "",
      past_experience: "",
      motivation: "",
      department: "",
      batch: "",
      position: "",
    },
  });

  const toggleStatus = data?.toggleStatus || { islive: 0 };
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
      setIsSubmissionSuccessful(true);
    }
  }, [actionData, toast]);

  useEffect(() => {
    if (isSubmissionSuccessful) {
      toast({
        title: "Submission Successful",
        description: "Stay Tuned!",
        action: (
          <ToastAction altText="Dismiss" onClick={() => navigate("/")}>
            Ok
          </ToastAction>
        ),
      });
    }
  }, [isSubmissionSuccessful, toast, navigate]);

  const onSubmit = async (values) => {
    const body = new URLSearchParams(values);
    const res = await fetch("http://127.0.0.1:5001/api/register_induction", {
      method: "POST",
      body,
    });

    const result = await res.json();

    if (!res.ok) {
      toast({
        title: "Submission Failed",
        description: result.error,
        variant: "destructive",
        action: <ToastAction altText="Retry">Retry</ToastAction>,
      });
    } else {
      // Success: show toast and reset form
      toast({
        title: "Submission Successful",
        description: "Stay Tuned!",
        action: (
          <ToastAction altText="Dismiss" onClick={() => navigate("/")}>
            Ok
          </ToastAction>
        ),
      });
      form.reset();
    }
  };

  const headings = () => {
    if (!islive) return "Inductions are currently closed";
    return "Apply Now";
  };

  return (
    <div className="w-full flex justify-center items-center absolute top-24 z-10">
      <Card className="bg-white shadow-2xl rounded-2xl w-[90%] lg:w-[80%] max-h-[90vh]">
        <CardHeader className=" top-0 z-10 ">
          <CardTitle className="text-red-700 text-2xl lg:text-3xl font-medium text-center">
            {headings()}
          </CardTitle>
        </CardHeader>
        {/* <ScrollArea className="h-[70vh] px-6"> */}
          <CardContent className="p-6">
            {islive ? (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        {...form.register("name")}
                        placeholder="Enter your full name"
                      />
                      <p className="text-sm text-red-500">
                        {form.formState.errors.name?.message}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="rollno">Roll No</Label>
                      <Input
                        id="rollno"
                        {...form.register("rollno")}
                        placeholder="22k-XXXX"
                      />
                      <p className="text-sm text-red-500">
                        {form.formState.errors.rollno?.message}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        {...form.register("email")}
                        placeholder="example@nu.edu.pk"
                      />
                      <p className="text-sm text-red-500">
                        {form.formState.errors.email?.message}
                      </p>
                    </div>
                  </div>

                  {/* Selection Fields */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="department">Department</Label>
                      <select
                        id="department"
                        {...form.register("department")}
                        className="w-full border rounded-md p-2"
                      >
                        <option value="">Select department</option>
                        <option value="BCS">BCS</option>
                        <option value="BEE">BEE</option>
                        <option value="BCY">BCY</option>
                        <option value="BAI">BAI</option>
                      </select>
                      <p className="text-sm text-red-500">
                        {form.formState.errors.department?.message}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="batch">Batch</Label>
                      <select
                        id="batch"
                        {...form.register("batch")}
                        className="w-full border rounded-md p-2"
                      >
                        <option value="">Select batch</option>
                        <option value="Freshie">Freshie</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                      </select>
                      <p className="text-sm text-red-500">
                        {form.formState.errors.batch?.message}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="position">Position</Label>
                      <select
                        id="position"
                        {...form.register("position")}
                        className="w-full border rounded-md p-2"
                      >
                        <option value="">Select position</option>
                        <option value="Secretary">Secretary</option>
                        <option value="Chairperson">Chairperson</option>
                        <option value="Member">Member</option>
                      </select>
                      <p className="text-sm text-red-500">
                        {form.formState.errors.position?.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Large Text Areas */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="past_experience">Past Experience</Label>
                    <textarea
                      id="past_experience"
                      {...form.register("past_experience")}
                      className="w-full border rounded-md p-2 min-h-[40px]"
                      placeholder="Describe your past experience"
                    />
                    <p className="text-sm text-red-500">
                      {form.formState.errors.past_experience?.message}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="motivation">Motivation</Label>
                    <textarea
                      id="motivation"
                      {...form.register("motivation")}
                      className="w-full border rounded-md p-2 min-h-[40px]"
                      placeholder="Why do you want to join?"
                    />
                    <p className="text-sm text-red-500">
                      {form.formState.errors.motivation?.message}
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 text-white py-6 text-lg"
                >
                  Submit Application
                </Button>
              </form>
            ) : (
              <div className="flex justify-center py-10">
                <Badge variant="outline" className="text-lg py-2 px-4">
                  Inductions are currently closed. Check back later!
                </Badge>
              </div>
            )}
          </CardContent>
        {/* </ScrollArea> */}
      </Card>
    </div>
  );
};

export default Team;