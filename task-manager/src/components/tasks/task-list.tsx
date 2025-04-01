'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useTasks } from "./task-context";
import type { Task } from "./task-context";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";

interface EditTaskFormProps {
  task: Task;
  onSave: (taskId: string, updatedTask: Partial<Task>) => void;
  onClose: () => void;
}

function EditTaskForm({ task, onSave, onClose }: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.due_date);
  const [priority, setPriority] = useState<Task['priority']>(task.priority);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(task.id, { title, due_date: dueDate, priority });
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

interface SortableTaskItemProps {
  task: any;
  onEdit: (taskId: string) => void;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

function SortableTaskItem({ task, onEdit, onToggle, onDelete }: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

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
    <div ref={setNodeRef} style={style} {...attributes} id={`task-${task.id}`}>
      <Card className={`p-4 bg-[#E6EEF8] border-[#5C7BA1] transition-all duration-300 ${isDragging ? 'opacity-50' : ''}`}>
        <div className="flex items-center gap-3">
          <button 
            className="cursor-grab active:cursor-grabbing text-[#5C7BA1] hover:text-[#3D5A80] focus:outline-none" 
            {...listeners}
          >
            <GripVertical className="size-4.5" />
          </button>
          <div className="flex-1 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className={`font-medium text-[15px] text-[#1E3D59] ${task.completed ? 'line-through opacity-70' : ''}`}>
                {task.title}
              </h3>
              <p className="text-sm text-[#3D5A80]">
                Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getPriorityStyles(task.priority)} text-sm`} variant="secondary">
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(task.id)}
                  className="h-8 w-8 border-[#3D5A80] text-[#3D5A80] hover:bg-[#98B5D5]/20"
                >
                  <Pencil className="size-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onToggle(task.id)}
                  className="h-8 px-3 border-[#3D5A80] text-[#3D5A80] hover:bg-[#98B5D5]/20 text-sm"
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => onDelete(task.id)}
                  className="h-8 w-8 border-[#3D5A80] text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function TaskList() {
  const { filteredTasks, tasks, toggleTask, updateTask, deleteTask, updateTaskOrder } = useTasks();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      
      const newOrder = arrayMove(tasks, oldIndex, newIndex);
      updateTaskOrder(newOrder);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const editingTask = editingTaskId ? tasks.find(t => t.id === editingTaskId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="rounded-lg border border-[#5C7BA1]/30 bg-white/50 p-4 relative">
        <div className="h-[calc(100vh-14rem)] overflow-y-auto pr-2" style={{ isolation: 'isolate' }}>
          <SortableContext items={filteredTasks} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 relative">
              {filteredTasks.map((task) => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  onEdit={(id) => setEditingTaskId(id)}
                  onToggle={toggleTask}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      </div>
      
      {editingTask && (
        <Dialog 
          open={editingTaskId !== null} 
          onOpenChange={(open) => !open && setEditingTaskId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <EditTaskForm
              task={editingTask}
              onSave={updateTask}
              onClose={() => setEditingTaskId(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </DndContext>
  );
} 