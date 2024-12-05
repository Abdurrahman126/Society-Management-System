import React, { act } from "react";
import { useLocation, Form, useActionData } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { passwordChanged, selectPassword, selectRoll } from "../../login/loginSlice";
import { loggedIn } from "../../forum/forumSlice";
export async function action({request}){
  const formData = new URLSearchParams(await request.formData());
    const new_password=formData.get('new_password')
  const response = await fetch('http://127.0.0.1:5001/api/change_password_excom', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (response.ok) {
    return  {new_password:new_password,success:true}
  } else {
    return { error: data.error }
  }
}
const MemberHome = () => {
  const actionData=useActionData();
  const dispatch=useDispatch();
  if(actionData?.success){
    dispatch(passwordChanged(actionData.new_password));
  }
  const password=useSelector(selectPassword);
  const roll_number=useSelector(selectRoll);
  
  return (
    <div>
           {password === "fast1234" && 
        (<Dialog open className="animate-open">
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enter New Password</DialogTitle>
              <DialogDescription>
                <p>Using the default password could lead to security concerns</p>
              </DialogDescription>
            </DialogHeader>
            <Form
              method="post"
              className="w-[90%] flex flex-col justify-evenly items-center gap-4"
            >

               <input type="hidden" name="roll_number" value={roll_number}/>
               <input type="hidden" name="current_password" value={password}/>
             
              <label htmlFor="new_password">Password</label>
              <Input
                name="new_password"
                className="text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 lg:w-[70%] w-[90%] focus:border-red-600 focus:border-2"
              />
              <DialogClose asChild>
                <Button type="submit">Save changes</Button>
              </DialogClose>
            </Form>
          </DialogContent>
        </Dialog>)
    }
    </div>)
};

export default MemberHome;
