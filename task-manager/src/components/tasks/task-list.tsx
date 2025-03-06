'use client';

import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useState } from "react";
import { useTasks, type Task } from "./task-context";
import { Pencil, Trash2 } from "lucide-react";

interface EditTaskFormProps {
  task: Task;
  onSave: (taskId: string, updatedTask: Partial<Task>) => void;
  onClose: () => void;
}

function EditTaskForm({ task, onSave, onClose }: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [priority, setPriority] = useState<Task['priority']>(task.priority);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(task.id, { title, dueDate, priority });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select 
          value={priority} 
          onValueChange={(value: Task['priority']) => setPriority(value)}
        >
          <SelectTrigger>
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
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}

export function TaskList() {
  const { filteredTasks, toggleTask, updateTask, deleteTask } = useTasks();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "medium":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
      case "low":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <Card key={task.id} className="p-4 bg-[#E6EEF8] border-[#5C7BA1]">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className={`font-medium text-[#1E3D59] ${task.completed ? 'line-through opacity-70' : ''}`}>
                {task.title}
              </h3>
              <p className="text-sm text-[#3D5A80]">Due: {task.dueDate}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getPriorityStyles(task.priority)} variant="secondary">
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <div className="flex items-center gap-2">
                <Dialog 
                  open={editingTaskId === task.id} 
                  onOpenChange={(open) => setEditingTaskId(open ? task.id : null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-[#3D5A80] text-[#3D5A80] hover:bg-[#98B5D5]/20"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Task</DialogTitle>
                    </DialogHeader>
                    <EditTaskForm
                      task={task}
                      onSave={updateTask}
                      onClose={() => setEditingTaskId(null)}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleTask(task.id)}
                  className="border-[#3D5A80] text-[#3D5A80] hover:bg-[#98B5D5]/20"
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 