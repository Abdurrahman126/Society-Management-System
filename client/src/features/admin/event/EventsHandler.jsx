import React from 'react';
import { useLoaderData, Form } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Events from '@/components/Events';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export async function loader() {
  try {
    const response = await fetch('http://127.0.0.1:5001/api/events');
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export const action = async ({ request }) => {
  const formData = new URLSearchParams(await request.formData());
  const intent = formData.get("intent");

  if (intent === "post") {
    const response = await fetch('http://127.0.0.1:5001/api/add_event', {
      method: 'POST',
      body: formData,
    });
    const postdata = await response.json();

    if (response.ok) {
      return { message: postdata.message };
    } else {
      console.log(postdata.message);
      return { error: postdata.error };
    }
  } else if (intent === "delete") {
    const id = formData.get('id');
    const response = await fetch(`http://127.0.0.1:5001/api/delete_event/${id}`, {
      method: 'delete',
    });

    const data = await response.json();

    if (response.ok) {
      return { message: data.message };
    } else {
      console.log(data.message);
      return { error: data.error };
    }
  }
  return null;
};

const EventsHandler = () => {
  const array = useLoaderData();
  const events = array.map((item) => (
    <Events
      key={item.event_id}
      id={item.event_id}
      name={item.event_title}
      description={item.about_event}
      eventOn={item.event_date}
      tag="Delete Event"
    />
  ));

  return (
    <div className="min-h-screen  py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-8 text-center">Events Live</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events}
          <Card className="bg-white border-dashed border-2 border-red-600 transition-all duration-300">
            <CardContent className="p-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full h-full flex flex-col items-center justify-center text-gray-600 hover:text-red-600">
                    <Plus className="h-12 w-12 mb-2" />
                    <span className="text-lg font-medium">Add Event</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new event below.
                    </DialogDescription>
                  </DialogHeader>
                  <Form method="post" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="event_title">Event Title</Label>
                      <Input id="event_title" name="event_title" placeholder="Annual Dinner" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about_event">About Event</Label>
                      <Input id="about_event" name="about_event" placeholder="Join us now!" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue</Label>
                      <Input id="venue" name="venue" placeholder="Audi" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event_date">Event Date</Label>
                      <Input id="event_date" name="event_date" type="date" required />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="submit" name="intent" value="post">Save Event</Button>
                      </DialogClose>
                    </DialogFooter>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventsHandler;

