"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useTasks } from "@/components/tasks/task-context";
import { toast } from "react-hot-toast";

interface AddTaskData {
  title: string;
  due_date: string;
  priority: "low" | "medium" | "high";
}

export function AddTaskForm() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [due_date, setDueDate] = useState<string>("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Debug logging
    console.log('Submit values:', {
      title,
      due_date,
      priority
    });

    if (!title || !due_date) {
      console.log('Missing fields - title:', title, 'due_date:', due_date);
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Create the task data
      const taskData: AddTaskData = {
        title: title.trim(),
        due_date,
        priority,
      };

      console.log('Submitting task data:', taskData);

      await addTask(taskData);
      
      setTitle("");
      setDueDate("");
      setPriority("medium");
      toast.success("Task added successfully");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
          <Input
            id="title"
            placeholder="Enter task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date <span className="text-red-500">*</span></Label>
          <Input
            id="due_date"
            type="date"
            value={due_date}
            onChange={(e) => {
              const value = e.target.value;
              console.log('Date input change:', value);
              setDueDate(value);
            }}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Add Task</Button>
        </div>
      </form>
    </Card>
  );
} 