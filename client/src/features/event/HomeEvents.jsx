import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Timer from '@/components/Timer'
import { CalendarDays, MapPin } from 'lucide-react'

const HomeEvents = ({ name, description, id, eventOn, btnAction, venue }) => {
    return (
        <Card className="flex flex-col justify-evenly items-stretch flex-1 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden aspect-square">
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
                    onClick={btnAction}
                >
                    Book Now
                </Button>
            </CardFooter>
        </Card>
    );
};

export default HomeEvents

