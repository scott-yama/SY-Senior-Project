"use client";

import { Button } from "@/components/ui/button";
import { useTasks } from "@/components/tasks/task-context";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function TaskList() {
  const { filteredTasks, toggleTask, deleteTask } = useTasks();

  async function handleDelete(taskId: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete task");
    }
  }

  function formatDate(date: string) {
    if (!date) return 'No due date';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

  return (
    <div className="space-y-2">
      {filteredTasks.map((task) => (
        <div 
          key={task.id} 
          className="relative flex items-center justify-between p-4 bg-[#EBF2FA] rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="text-gray-400">
              ⋮⋮
            </div>
            <div>
              <h3 className="text-[#1E3D59] font-medium">{task.title}</h3>
              <p className="text-sm text-[#3D5A80]">
                Due: {formatDate(task.due_date)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-sm ${
              task.priority === 'high' ? 'bg-red-100 text-red-500' :
              task.priority === 'medium' ? 'bg-orange-100 text-orange-500' :
              'bg-green-100 text-green-500'
            }`}>
              {task.priority}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleDelete(task.id, e)}
                className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <Button 
                variant="outline"
                onClick={() => toggleTask(task.id)}
              >
                {task.completed ? 'Incomplete' : 'Complete'}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 