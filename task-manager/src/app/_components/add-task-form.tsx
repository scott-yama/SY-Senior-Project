"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddTaskForm() {
  return (
    <Card className="p-4">
      <form className="flex gap-4">
        <Input 
          placeholder="Enter task title..." 
          className="flex-1"
        />
        <Input 
          type="date" 
          className="w-[180px]"
        />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">Add Task</Button>
      </form>
    </Card>
  );
} 