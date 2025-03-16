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
import { useTasks } from "./task-context";
import { Plus } from "lucide-react";

export function AddTaskForm() {
  const { addTask } = useTasks();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');

  const resetForm = () => {
    setTitle('');
    setDueDate('');
    setPriority('medium');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      title,
      dueDate,
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
          <DialogTitle className="text-[#1E3D59]">Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex gap-1 text-[#1E3D59]">
              Title
              <span className="text-red-500">*</span>
            </Label>
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
            <Label htmlFor="dueDate" className="flex gap-1 text-[#1E3D59]">
              Due Date
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              max="9999-12-31"
              required
              className="border-[#5C7BA1] focus-visible:ring-[#3D5A80] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:inline-flex [&::-webkit-calendar-picker-indicator]:ml-auto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="flex gap-1 text-[#1E3D59]">
              Priority
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={priority}
              onValueChange={(value: Task['priority']) => setPriority(value)}
              required
            >
              <SelectTrigger id="priority" className="border-[#5C7BA1] focus:ring-[#3D5A80]">
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