import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loggedIn } from './loginSlice';

const formSchema = z.object({
  rollno: z
    .string()
    .min(1, "Roll number is required.")
    .regex(/^\d{2}[kK]-\d{4}$/, {
      message: "Roll number must be in the format 22k-4297",
    }),
  password: z.string().min(1, "Password is required."),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rollno: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      // Convert to URLSearchParams for form-encoded request (backend expects this)
      const urlParams = new URLSearchParams();
      urlParams.append('rollno', values.rollno);
      urlParams.append('password', values.password);

      const response = await fetch('http://127.0.0.1:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlParams.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(loggedIn({ roll: values.rollno, pass: values.password }));
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        form.reset();
        navigate('/members/meetings');
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className='h-dvh w-full flex justify-center items-center'>
      <div className='bg-white lg:w-[35%] w-[80%] h-[60%] rounded-2xl flex flex-col items-center justify-evenly animate-open'> 
        <h1 className='text-black lg:text-4xl text-2xl font-bold'>Sign In</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[90%] flex flex-col justify-evenly items-center gap-4">
          <div className="w-full lg:w-[70%] space-y-1">
            <Label htmlFor="rollno">Roll Number</Label>
            <Input
              id="rollno"
              type="text"
              {...form.register("rollno")}
              placeholder="22k-4297"
              className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 w-full focus:border-red-600 focus:border-2'
            />
            <p className="text-sm text-red-500">{form.formState.errors.rollno?.message}</p>
          </div>

          <div className="w-full lg:w-[70%] space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
              placeholder="Password"
              className='text-xs lg:text-base text-black border-black border-2 rounded-lg p-2 w-full mb-8'
            />
            <p className="text-sm text-red-500">{form.formState.errors.password?.message}</p>
          </div>

          <Button type="submit" className='bg-red-600 text-white lg:p-4 p-3 rounded-lg lg:w-[70%] w-[90%] hover:bg-white hover:text-black hover:border-2 hover:border-black'>
            Proceed
          </Button>
        </form>
        <p className='text-black text-opacity-60 text-xs lg:text-base'>Haven't joined us yet? <span className='text-red-600 cursor-pointer' onClick={()=>{
          navigate('/register')
        }}>Sign up now!</span></p>
      </div>
    </div>
  )
}

export default Login