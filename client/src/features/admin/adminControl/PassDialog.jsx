import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form } from "react-router-dom";

const PassDialog = ({ rollno, isAdmin }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isAdmin}>
          {isAdmin ? "Added!" : "Add as Admin"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Admin Password</DialogTitle>
          <DialogDescription>
            Password shall be sent through email
          </DialogDescription>
        </DialogHeader>
        <Form method="post">
          <input type="hidden" name="rollno" value={rollno} />
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input id="password" name="password" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" name="intent" value="add">Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PassDialog;
