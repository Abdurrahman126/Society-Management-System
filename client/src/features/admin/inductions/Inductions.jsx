

import React, { useState, useEffect } from 'react';
import { useLoaderData, Form, useFetcher } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import DataTable from './DataTable';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from "@/components/ui/toast";

export async function loader() {
  try {
    const [isOn, applicants, excom] = await Promise.all([
      fetch('http://127.0.0.1:5001/api/toggle_status'),
      fetch('http://127.0.0.1:5001/api/applicants'),
      fetch('http://127.0.0.1:5001/api/fetch_excom')
    ]);

    if (!isOn.ok || !applicants.ok || !excom.ok) {
      throw new Error("Failed to fetch data");
    }
    const isOnResult = await isOn.json();
    const applicantsResults = await applicants.json();
    const excomResults = await excom.json();

    return {
      isOn: isOnResult,
      applicants: applicantsResults,
      excom: excomResults,
    };
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function action({ request }) {
  const formData = new URLSearchParams(await request.formData());
  console.log("value in form:", formData.get('new_status'))
  const response = await fetch('http://127.0.0.1:5001/api/toggle_induction', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (response.ok) {
    return { message: data.message }
  } else {
    return { error: data.error }
  }
}

const Inductions = () => {
  const data = useLoaderData();
  const fetcher = useFetcher();
  console.log(data);
  const [isOn, setIsOn] = useState(data?.isOn?.islive || false);
  const [applicants, setApplicants] = useState(data?.applicants || []);
  const [excom, setExcom] = useState(data?.excom || []);
  const [errorMessage, setErrorMessage] = useState("");
  const [appointmentSuccess, setAppointmentSuccess] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (appointmentSuccess === "false" && errorMessage) {
      toast({
        title: "Appointment Unsuccessful",
        description: errorMessage,
        variant: "destructive",
        action: <ToastAction altText="Retry">Ok</ToastAction>,
      });
    }
  }, [appointmentSuccess, errorMessage, toast]);

  const acceptInduction = async (applicant) => {
    try {
      const response = await fetch("http://127.0.0.1:5001/api/appoint_excom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: applicant.email }),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrorMessage(error.message);
        setAppointmentSuccess("false");
        return;
      }

      const data = await response.json();
      setExcom((prevExcom) => [...prevExcom, applicant]);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while appointing the applicant.");
      setAppointmentSuccess("false");
    }
  };
  const handleToggle = (checked) => {
    fetcher.submit(
      { new_status: checked ? 1 : 0 },
      { method: "post" }
    );
    setIsOn(checked);
  };

  return (
    <div className="flex flex-col justify-center items-center pt-20">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className=" rounded-lg shadow-lg p-8 mb">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 md:mb-0">
              Inductions are{" "}
              <span>
                {isOn ? "open" : "closed"}
              </span>
            </h1>
            <div className="flex items-center space-x-4">
              <Form method="post">
                <input
                  type="hidden"
                  name="new_status"
                  value={isOn ? 0 : 1}
                />
              </Form>
              <div className="flex items-center space-x-3">
  <Switch
    id="induction-toggle"
    checked={isOn}
    onCheckedChange={handleToggle}
    className={`transition-all duration-300 ${
      isOn
        ? "bg-green-500"
        : "bg-gray-300"
    }`}
  />
  <label
    htmlFor="induction-toggle"
    className={`text-sm font-semibold transition-all duration-300 ${
      isOn ? "text-green-400" : "text-red-400"
    }`}
  >
    {isOn ? "Close Inductions" : "Open Inductions"}
  </label>
</div>

            </div>
          </div>
        </div>
      </div>
      {isOn && (
        <DataTable
          excom={excom}
          applicants={applicants}
          handleAccept={acceptInduction}
        />
      )}
    </div>
  );
};

export default Inductions;

