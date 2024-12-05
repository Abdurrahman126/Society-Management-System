import React from 'react';
import { useLoaderData, Form } from 'react-router-dom';
import { Plus } from 'lucide-react';
import MeetingCard from '@/components/MeetingCard';
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
    const response = await fetch('http://127.0.0.1:5001/api/get_meetings');
    if (!response.ok) {
      throw new Error('Failed to fetch meetings');
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
    const response = await fetch('http://127.0.0.1:5001/api/add_meeting', {
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
    const response = await fetch(`http://127.0.0.1:5001/api/delete_meeting/${id}`, {
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

const Meeting = () => {
  const array = useLoaderData();
  const meetings = array.map((item) => (
    <MeetingCard
      key={item.meeting_id}
      id={item.meeting_id}
      title={item.title}
      purpose={item.purpose}
      venue={item.venue}
      date={item.meeting_date}
      tag="Delete Meeting"
    />
  ));

  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-7xl mx-auto flex flex-col h-full  w-full justify-center items-center ">
        <h1 className="text-white text-4xl font-bold mb-8 text-center">Meeting Channel</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {meetings}
          <Card className="bg-white border-dashed border-2 border-red-600 transition-all duration-300">
            <CardContent className="p-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full h-full flex flex-col items-center justify-center text-gray-600 hover:text-red-600">
                    <Plus className="h-12 w-12 mb-2" />
                    <span className="text-lg font-medium">Add Meeting</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Meeting</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new meeting below.
                    </DialogDescription>
                  </DialogHeader>
                  <Form method="post" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="meeting_title">Meeting Title</Label>
                      <Input id="meeting_title" name="meeting_title" placeholder="Monthly Meeting" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose</Label>
                      <Input id="purpose" name="purpose" placeholder="Discussion about upcoming event" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue</Label>
                      <Input id="venue" name="venue" placeholder="EE A4" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Meeting Date</Label>
                      <Input id="date" name="date" type="date" required />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="submit" name="intent" value="post">Save Meeting</Button>
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

export default Meeting;

