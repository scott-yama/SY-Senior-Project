'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Task, useTasks } from "./task-context";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function AddTaskForm() {
  const { addTask } = useTasks();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");

  const resetForm = () => {
    setTitle('');
    setDueDate('');
    setPriority("low");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dueDate) return;

    const formattedDate = format(new Date(dueDate), 'yyyy-MM-dd');
    console.log('Submitting task with date:', formattedDate);
    
    addTask({
      title,
      due_date: formattedDate,
      priority,
    });
    resetForm();
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-[#3D5A80] hover:bg-[#2C4B6F] text-white">
          <Plus className="size-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-[#5C7BA1] focus-visible:ring-[#3D5A80]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="mm/dd/yyyy"
              className="border-[#5C7BA1] focus-visible:ring-[#3D5A80] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:inline-flex [&::-webkit-calendar-picker-indicator]:ml-auto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}
            >
              <SelectTrigger 
                id="priority" 
                className="border-[#5C7BA1] focus:ring-[#3D5A80]"
              >
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="border-[#5C7BA1] text-[#3D5A80] hover:bg-[#E6EEF8]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title || !dueDate || !priority}
              className="bg-[#3D5A80] hover:bg-[#2C4B6F] text-white"
            >
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 