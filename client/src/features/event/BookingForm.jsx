import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  batch: z.string().min(1, "Batch is required."),
  email: z
    .string()
    .email("Invalid email address.")
    .refine((val) => val.endsWith("@nu.edu.pk"), {
      message: "Email must end with @nu.edu.pk",
    }),
  rollno: z
    .string()
    .regex(/^\d{2}[kK]-\d{4}$/, {
      message: "Roll number must be in the format 22k-4297",
    }),
  number: z
    .string()
    .regex(/^03\d{9}$/, {
      message: "Phone number must be 11 digits starting with 03",
    }),
  transaction_id: z.string().min(1, "Transaction code is required."),
});


const BookingForm = ({ eventData }) => {
  const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      const payload = { ...values, event_id: eventData?.event_id };
      const response = await fetch("http://127.0.0.1:5001/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setIsBookingSuccessful(true);
        form.reset();
      } else {
        toast({ title: "Booking Failed", description: data.error });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong." });
    }
  };

  useEffect(() => {
    if (isBookingSuccessful) {
      toast({
        title: "Booking Successful",
        description: `Collect ticket from PR desk. Ticket #: ${Math.floor(Math.random() * 400 + 100)}`,
        action: (
          <ToastAction altText="OK" onClick={() => navigate("/")}>
            OK
          </ToastAction>
        ),
      });
    }
  }, [isBookingSuccessful]);

  return (
    <Card className="max-w-xl bg-white shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-red-600">Book Your Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {["name", "email", "rollno", "number", "transaction_id"].map((field) => (
            <div key={field} className="space-y-1">
              <Label htmlFor={field}>{field === "transaction_id" ? "Transaction Code" : field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input
                id={field}
                type="text"
                {...form.register(field)}
                placeholder={`Enter your ${field.replace("_", " ")}`}
              />
              <p className="text-sm text-red-500">{form.formState.errors[field]?.message}</p>
            </div>
          ))}

          <div className="space-y-1">
            <Label htmlFor="batch">Batch</Label>
            <select
              id="batch"
              {...form.register("batch")}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select your batch</option>
              <option value="Freshie">Freshie</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
            <p className="text-sm text-red-500">{form.formState.errors.batch?.message}</p>
          </div>

          <Button type="submit" className="w-full bg-red-600 text-white">
            Book Now
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
