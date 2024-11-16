import React from 'react';
import { Form, useLoaderData } from 'react-router-dom';
export async function loader({ params }) {
    const eventId = params.id;
    try {
        const response = await fetch(`http://127.0.0.1:5001/api/events/${eventId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch event data');
        }
        const data = await response.json();
        return data; // Return event data if successful
    } catch (error) {
        console.log(error.message);
        return { error: 'Failed to load event data' }; // Return an error object
    }
}



export async function action({ request }) {
    
    return null;
}

const Booking = () => {
    const data = useLoaderData();
        console.log(data);
    return (
        <Form method="post" action="http://127.0.0.1:5001/api/bookings" className="flex flex-col">
    <input type="hidden" name="event_id" value={data.event_id} />
    <label htmlFor="name" className="text-black">Name:</label>
    <input name="name" type="text" required className="bg-gray-300 rounded-lg" />
    <label htmlFor="batch" className="text-black">Batch:</label>
    <input name="batch" type="text" required className="bg-gray-300 rounded-lg" />
    <label htmlFor="email" className="text-black">Email:</label>
    <input name="email" type="email" required className="bg-gray-300 rounded-lg" />
    <label htmlFor="number" className="text-black">Phone:</label>
    <input name="number" type="text" required className="bg-gray-300 rounded-lg" />
    <button type="submit" className="w-full bg-red-600 bg-opacity-80 text-gray-300 border-none rounded py-2 flex items-center justify-center cursor-pointer hover:brightness-90">
        Confirm Booking
    </button>
</Form>

    );
}

export default Booking;
