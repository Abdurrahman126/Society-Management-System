import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Timer from '@/components/Timer';
import { CalendarDays, MapPin } from 'lucide-react';
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
  import BookingForm from './BookingForm';
const HomeEvents = ({ name, description, id, eventOn, btnAction, venue }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleModalClose = () => setIsOpen(false);
    const handleModalOpen = () => setIsOpen(true);

    return (
        <Card className="flex flex-col justify-evenly bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden aspect-square">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-gray-900">{name}</CardTitle>
                <CardDescription className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {venue}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-gray-700 mb-4">{description}</p>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {new Date(eventOn).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </div>
                <div>
                    <p className="font-medium text-gray-900 mb-1">Event starts in</p>
                    <Timer eventOn={eventOn} />
                </div>
            </CardContent>
            <CardFooter className="pt-4">
                <Button 
                    className="w-full bg-red-700 hover:bg-red-800 text-white" 
                    onClick={handleModalOpen}
                >
                    Book Now
                </Button>
            </CardFooter>

            {/* Modal for Booking */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger />
  <DialogContent className="bg-white p-7 rounded-2xl max-w-lg mx-auto">
    <BookingForm eventData={{ event_id: id }} />

    
  </DialogContent>
</Dialog>

        </Card>
    );
};

export default HomeEvents;
