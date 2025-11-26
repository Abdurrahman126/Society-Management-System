import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from 'lucide-react';
import Timer from './Timer';
import { useNavigate, Form } from 'react-router-dom';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger, DialogClose, DialogFooter
} from "@/components/ui/dialog";

const Events = ({ name, description, id, eventOn, tag }) => {
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) fetchBookings();
  }, [open]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/bookings/${id}`);
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white border-none overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-gray-900">{name}</CardTitle>
          <Form method="delete">
            <input type="hidden" name="id" value={id} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
              name="intent"
              type="submit"
              value="delete"
            >
              <span className="sr-only">Delete</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </Button>
          </Form>
        </div>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-2 text-red-600" />
          <span className="text-sm">{new Date(eventOn).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-red-600" />
          <span className="text-sm font-medium">Event starts in</span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 items-start">
        <Timer eventOn={eventOn} />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-2 border-2 border-black">
              View Bookings
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bookings for "{name}"</DialogTitle>
              <DialogDescription>
                {loading
                  ? 'Loading bookings...'
                  : bookings.length === 0
                  ? 'No bookings yet.'
                  : `Total bookings: ${bookings.length}`}
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[300px] overflow-y-auto space-y-2 mt-2">
              {bookings.map((booking, index) => (
                <div key={`${booking.email}-${index}`} className="text-sm p-2 border rounded bg-gray-100 text-gray-800">
                  {booking.name} – {booking.email}
                </div>
              ))}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default Events;
