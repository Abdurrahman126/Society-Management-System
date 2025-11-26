import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Full Name is required."),
  rollno: z
    .string()
    .min(1, "Roll number is required.")
    .regex(/^\d{2}[kK]-\d{4}$/, {
      message: "Roll number must be in the format 22k-4297",
    }),
  department: z
    .string()
    .min(1, "Department is required.")
    .refine((val) => val.length <= 4, {
      message: "not a valid department",
    }),
  section: z.string().min(1, "Section is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email address.")
    .refine((val) => val.endsWith("@nu.edu.pk"), {
      message: "Email must end with @nu.edu.pk",
    }),
  password: z.string().min(1, "Password is required."),
  confirm: z.string().min(1, "Please confirm your password."),
  batch: z.string().min(1, "Batch is required."),
  team: z.string().min(1, "Please select a team."),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      rollno: "",
      department: "",
      section: "",
      email: "",
      password: "",
      confirm: "",
      batch: "",
      team: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      // Convert to URLSearchParams for form-encoded request (backend expects this)
      const urlParams = new URLSearchParams();
      urlParams.append('rollno', values.rollno);
      urlParams.append('name', values.name);
      urlParams.append('batch', values.batch);
      urlParams.append('department', values.department);
      urlParams.append('section', values.section);
      urlParams.append('email', values.email);
      urlParams.append('password', values.password);
      urlParams.append('confirm', values.confirm);
      urlParams.append('team', values.team);

      const response = await fetch('http://127.0.0.1:5001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlParams.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "Welcome! Redirecting to member portal...",
        });
        form.reset();
        navigate('/members');
      } else {
        toast({
          title: "Registration Failed",
          description: data.error || "Something went wrong. Please try again.",
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
    <div className='min-h-screen w-full flex justify-center items-center py-20'>
      <Card className='w-full max-w-2xl mx-auto rounded-2xl shadow-lg animate-open'>
        <CardHeader>
          <CardTitle className='text-3xl font-bold text-center text-black'>Member Induction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder='Full Name'
                />
                <p className="text-sm text-red-500">
                  {form.formState.errors.name?.message}
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="batch">Batch</Label>
                <Controller
                  name="batch"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your batch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Freshie">Freshie</SelectItem>
                        <SelectItem value="Sophomore">Sophomore</SelectItem>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-sm text-red-500">
                  {form.formState.errors.batch?.message}
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="rollno">Roll Number</Label>
                <Input
                  id="rollno"
                  {...form.register("rollno")}
                  placeholder='22k-4297'
                />
                <p className="text-sm text-red-500">
                  {form.formState.errors.rollno?.message}
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  {...form.register("department")}
                  placeholder='e.g. BCS'
                />
                <p className="text-sm text-red-500">
                  {form.formState.errors.department?.message}
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  {...form.register("section")}
                  placeholder='Section'
                />
                <p className="text-sm text-red-500">
                  {form.formState.errors.section?.message}
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder='example@nu.edu.pk'
                />
                <p className="text-sm text-red-500">
                  {form.formState.errors.email?.message}
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  placeholder='Password'
                />
                <p className="text-sm text-red-500">
                  {form.formState.errors.password?.message}
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  {...form.register("confirm")}
                  placeholder='Confirm Password'
                />
                <p className="text-sm text-red-500">
                  {form.formState.errors.confirm?.message}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label>Choose Team</Label>
              <Controller
                name="team"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-wrap gap-4"
                  >
                    {['MNP', 'Graphics', 'Security', 'General'].map((team) => (
                      <div key={team} className="flex items-center space-x-2">
                        <RadioGroupItem value={team} id={team} />
                        <Label htmlFor={team}>{team}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
              <p className="text-sm text-red-500">
                {form.formState.errors.team?.message}
              </p>
            </div>

            <Button type="submit" className='w-full bg-red-600 hover:bg-red-700 text-white'>
              Proceed
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
