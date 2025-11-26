import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Form } from 'react-router-dom';

const MeetingCard = ({ title, purpose, venue, date, id,btn }) => {
  return (
    <Card className="bg-white border-none overflow-hidden transition-all duration-300 hover:shadow-lg ">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
          <Form method="delete">
            <input type="hidden" name="id" value={id} />
            {btn && <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
              name="intent"
              type="submit"
              value="delete"
            >
              <span className="sr-only">Delete</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </Button> }
          </Form>
        </div>
        <CardDescription className="text-gray-600">{purpose}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-2 text-red-600" />
          <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-2 text-red-600" />
          <span className="text-sm">{venue}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-red-600" />
          <span className="text-sm font-medium">Meeting starts in</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {/* You can add a Timer component here if needed */}
      </CardFooter>
    </Card>
  );
};

export default MeetingCard;

