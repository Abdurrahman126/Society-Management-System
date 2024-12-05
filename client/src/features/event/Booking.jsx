import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { ToastAction } from "@/components/ui/toast"; // Import ToastAction

export async function loader({ params }) {
  const eventId = params.id;
  try {
    const response = await fetch(`http://127.0.0.1:5001/api/events/${eventId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch event data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
    return { error: "Failed to load event data" };
  }
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  batch: z.string().min(1, "Batch is required."),
  email: z.string().email("Invalid email address."),
  rollno: z.string().min(1, "Roll number is required."),
  number: z.string().min(1, "Phone number is required."),
  transaction_id: z.string().min(1, "Transaction code is required."),
});

const Booking = () => {
  const data = useLoaderData();
  const [message, setMessage] = useState("");
  const [isBookingSuccessful, setIsBookingSuccessful] = useState(false); // State to track booking success
  const { toast } = useToast(); // Get the toast function
  const navigate=useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      batch: "",
      email: "",
      rollno: "",
      number: "",
      transaction_id: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        event_id: data.event_id,
      };
      const response = await fetch("http://127.0.0.1:5001/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (response.ok) {
        setMessage(responseData.message);
        form.reset();
        setIsBookingSuccessful(true); // Set booking success state
      } else {
        setMessage(responseData.error || "Failed to submit booking.");
        setIsBookingSuccessful(false); // Set booking failure state
      }
    } catch (error) {
      setMessage("Failed to submit booking. Please try again.");
      setIsBookingSuccessful(false); // Set booking failure state
    }
  };

  useEffect(() => {
    if (isBookingSuccessful) {
      toast({
        title: "Booking Successful",
        description: `Please collect your ticket from the Pr Desk at your earliest convinence.\n
        Your ticket code #:${Math.floor(Math.random()*400+100)}`,
        action: (
          <ToastAction altText="Undo the booking" onClick={()=>{navigate('/')}}>Ok</ToastAction>
        ),
      });
    }
  }, [isBookingSuccessful, toast, data.event_id]); // Trigger toast when booking is successful

  return (
    <div className="h-dvh w-full flex flex-col justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white lg:w-[35%] w-[80%] h-[60%] rounded-2xl flex flex-col items-center justify-evenly animate-open"
        >
          {message && <div className="text-red-500">{message}</div>}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="batch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Select your batch</option>
                    <option value="Freshie">Freshie</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    {/* Add more batches as needed */}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rollno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rollno Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your rollno number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transaction_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your transaction code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]">
            Book
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Booking;
