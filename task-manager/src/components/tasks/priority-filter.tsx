'use client';

import { Button } from "../../components/ui/button";
import { useTasks, type Task } from "./task-context";
import { cn } from "../../lib/utils";

type Priority = Task['priority'] | 'all';

export function PriorityFilter() {
  const { selectedPriorities, togglePriorityFilter } = useTasks();

  const priorities: Priority[] = ['all', 'high', 'medium', 'low'];

  const getButtonStyles = (priority: Priority) => {
    const isSelected = selectedPriorities.has(priority);
    
    const baseStyles = "transition-all duration-200 font-medium";
    const hoverStyles = "hover:shadow-md hover:scale-105";
    
    const colorStyles = {
      all: cn(
        isSelected
          ? "bg-[#3D5A80] text-white hover:bg-[#2C4B6F]"
          : "text-[#3D5A80] border-[#3D5A80] hover:bg-[#3D5A80]/10",
        "hover:text-[#3D5A80]"
      ),
      high: cn(
        isSelected
          ? "bg-red-500 text-white hover:bg-red-600"
          : "text-red-500 border-red-500 hover:bg-red-50",
        "hover:text-red-700"
      ),
      medium: cn(
        isSelected
          ? "bg-orange-500 text-white hover:bg-orange-600"
          : "text-orange-500 border-orange-500 hover:bg-orange-50",
        "hover:text-orange-700"
      ),
      low: cn(
        isSelected
          ? "bg-green-500 text-white hover:bg-green-600"
          : "text-green-500 border-green-500 hover:bg-green-50",
        "hover:text-green-700"
      ),
    }[priority];

    return cn(baseStyles, hoverStyles, colorStyles);
  };

  return (
    <div className="flex gap-2">
      {priorities.map((priority) => (
        <Button
          key={priority}
          variant={selectedPriorities.has(priority) ? "default" : "outline"}
          onClick={() => togglePriorityFilter(priority)}
          className={getButtonStyles(priority)}
        >
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
          {selectedPriorities.has(priority) && priority !== 'all' && (
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-white/20">
              ✓
            </span>
          )}
        </Button>
      ))}
    </div>
  );
} 