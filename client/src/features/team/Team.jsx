import React from 'react';
import { Form, useLoaderData } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export async function loader() {
  try {
    const [toggleStatusResponse, fetchExcomResponse] = await Promise.all([
      fetch('https://alimurtazaathar.pythonanywhere.com/api/toggle_status'),
      fetch('https://alimurtazaathar.pythonanywhere.com/api/fetch_excom'),
    ]);

    if (!toggleStatusResponse.ok || !fetchExcomResponse.ok) {
      throw new Error('Failed to fetch data');
    }

    const toggleStatusData = await toggleStatusResponse.json();
    const fetchExcomData = await fetchExcomResponse.json();

    return {
      toggleStatus: toggleStatusData || null,
      excoms: fetchExcomData || [],
    };
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export const action = async ({ request }) => {
  const formData = new URLSearchParams(await request.formData());
  const response = await fetch('https://alimurtazaathar.pythonanywhere.com/api/register_induction', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (response.ok) {
    return { message: data.message };
  } else {
    console.log(data.message);
    return { error: data.error };
  }
};

const Team = () => {
  const data = useLoaderData();
  
  // Provide default values if data is null or missing
  const toggleStatus = data?.toggleStatus || { islive: 0 };
  const excoms = data?.excoms || [];

  const { islive } = toggleStatus;

  return (
    <div className='flex justify-center items-center h-full'>
      <div className='bg-white lg:w-[35%] w-[80%] h-[60%] rounded-2xl flex flex-col items-center justify-evenly animate-open py-4'>
        <h1 className='text-black lg:text-4xl text-2xl font-bold'>
          {islive === 1 ? "Apply Now" : "Inductions have closed"}
        </h1>
        {islive ? (
          <Form method="post" className='w-[90%] flex flex-col justify-evenly items-center gap-4'>
            <input name="name" placeholder='Full Name' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2' />
            <input name="rollno" placeholder='22k-4297' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2' />
            <select
              name="batch"
              id="batch"
              required
              className="text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2"
            >
              <option value="" disabled>Select your batch</option>
              <option value="Freshie">Freshie</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
            <input name="department" placeholder='Department e.g:BsCs' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2' />
            <input name="email" placeholder='Email Address' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2' />
            <label htmlFor="position" className='mr-auto opacity-70'>Choose Position</label>
            <select
              name="position"
              id="position"
              required
              className="text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2"
            >
              <option value="" disabled>Select your position</option>
              <option value="President">President</option>
              <option value="Vice President">Vice President</option>
              <option value="Treasurer">Treasurer</option>
              <option value="Secretary">Secretary</option>
              <option value="General Secretary">General Secretary</option>
              <option value="Event Manager">Event Manager</option>
            </select>
            <input name="past_experience" placeholder='Tell us about your past experiences' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2' />
            <input name="motivation" placeholder='What are your motivations' className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2' />
            <button className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%]' type="submit">Proceed</button>
          </Form>
        ) : (
          <Table>
            <TableCaption>Excom</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Position</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {excoms.map((excom) => (
                <TableRow key={excom.roll_number}>
                  <TableCell>{excom.name}</TableCell>
                  <TableCell>{excom.roll_number}</TableCell>
                  <TableCell>{excom.position}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Team;
