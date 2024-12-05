import React from 'react';
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
import { useLoaderData,Form } from 'react-router-dom';
import PassDialog from './PassDialog';

export async function loader() {
  try {
    const [excom, admins] = await Promise.all([
      fetch('http://127.0.0.1:5001/api/fetch_excom'),
      fetch('http://127.0.0.1:5001/api/fetch_admin')
    ]);

    if (!excom.ok || !admins.ok) {
      throw new Error("Failed to fetch data");
    }

    const excomData = await excom.json();
    const adminsData = await admins.json();

    return {
      admins: adminsData,
      excoms: excomData,
    };
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const rollno = formData.get("rollno");
  const password = formData.get("password");

  const url =
    intent === "add"
      ? "http://127.0.0.1:5001/api/add_admin"
      : "http://127.0.0.1:5001/api/remove_admin";
  const method = intent === "add" ? "POST" : "DELETE";

  const payload = intent === "add" ? { rollno, password } : { rollno };

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to process the request.");
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
}


const Control = () => {

  const data=useLoaderData();
  console.log(data);
  const excoms=data?.excoms ||[];
  const admins=data?.admins||[];
  return (
    <div className='bg-white'>
      <Table>
        <TableCaption>List of Excom members</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Roll Number</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {excoms.map((excom) => {
            const isAdmin = admins.some((admin) => admin.roll_number === excom.roll_number);

            return (
              <TableRow key={excom.roll_number}>
                <TableCell>{excom.name}</TableCell>
                <TableCell>{excom.roll_number}</TableCell>
                <TableCell>{excom.email}</TableCell>
                <TableCell>{excom.position}</TableCell>
                <TableCell>
                  <PassDialog
                    rollno={excom.roll_number}
                    isAdmin={isAdmin}
                  />
                  {isAdmin && (
                    <Form method="delete">

                    <input type="hidden" name="rollno" value={excom.roll_number}/>
                    <button
                      className='border-red-400 border-2 rounded-md p-2 hover:bg-red-300 ml-2'
                      name="intent" value="delete"
                      type="submit"
                    >
                      Remove
                    </button>
                    </Form>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Control;