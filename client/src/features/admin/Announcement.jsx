import React from 'react';
import { useLoaderData, Form } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AnnouncementCard from '@/components/AnnouncementCard';
import { Card, CardContent } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";

export async function loader() {
  try {
    const response = await fetch('http://127.0.0.1:5001/api/announcements');
    if (!response.ok) {
      throw new Error('Failed to fetch announcement data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
    return { error: 'Failed to load announcement data' };
  }
}

export const action = async ({ request }) => {
  const formData = new URLSearchParams(await request.formData());
  const intent = formData.get("intent");

  if (intent === "post") {
    const response = await fetch('http://127.0.0.1:5001/api/add_announcements', {
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
    const response = await fetch(`http://127.0.0.1:5001/api/delete_announcement/${id}`, {
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

const Announcement = () => {
  const array = useLoaderData();
  const announcements = array.map((item) => (
    <AnnouncementCard
      key={item.announcement_id}
      id={item.announcement_id}
      title={item.announcement_title}
      content={item.content}
      link={item.link}
    />
  ));

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-40">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-8 text-center">Announcements</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements}
          <Card className="bg-white border-dashed border-2 border-red-600 transition-all duration-300">
            <CardContent className="p-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full h-full flex flex-col items-center justify-center text-gray-600 hover:text-red-600">
                    <Plus className="h-12 w-12 mb-2" />
                    <span className="text-lg font-medium">Add Announcement</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Announcement</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new announcement below.
                    </DialogDescription>
                  </DialogHeader>
                  <Form method="post" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Announcement Title</Label>
                      <Input id="title" name="title" placeholder="Important Update" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea id="content" name="content" placeholder="Announcement details..." required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="link">Link (Optional)</Label>
                      <Input id="link" name="link" placeholder="https://example.com" />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="submit" name="intent" value="post">Post Announcement</Button>
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

export default Announcement;

