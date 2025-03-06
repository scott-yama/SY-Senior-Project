'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircleDot } from "lucide-react";
import { useTasks } from "./task-context";

export function TaskSidebar() {
  const { tasks } = useTasks();

  const categories = [
    { 
      name: "All Tasks", 
      tasks: tasks,
      count: tasks.length 
    },
    { 
      name: "In Progress", 
      tasks: tasks.filter(t => !t.completed),
      count: tasks.filter(t => !t.completed).length 
    },
    { 
      name: "Completed", 
      tasks: tasks.filter(t => t.completed),
      count: tasks.filter(t => t.completed).length 
    },
  ];

  return (
    <Card className="w-64 p-4 space-y-4 bg-[#E6EEF8] border-[#5C7BA1]">
      <h2 className="font-semibold text-[#1E3D59]">Categories</h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.name} className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-between text-[#1E3D59] hover:bg-[#98B5D5]/20 hover:text-[#3D5A80]"
            >
              {category.name}
              <span className="text-[#3D5A80]">{category.count}</span>
            </Button>
            {category.tasks.length > 0 && (
              <ul className="ml-4 space-y-1 text-sm text-[#3D5A80]">
                {category.tasks.map((task) => (
                  <li key={task.id} className="flex items-center gap-2 py-1">
                    <CircleDot className="size-2 text-[#5C7BA1]" />
                    {task.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
} 