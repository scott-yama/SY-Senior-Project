'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTasks } from "./task-context";
import { useState } from "react";

interface TaskListSectionProps {
  title: string;
  count: number;
  tasks: { id: string; title: string }[];
  isActive: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClick: () => void;
}

function TaskListSection({ 
  title, 
  count, 
  tasks, 
  isActive, 
  isExpanded, 
  onToggleExpand, 
  onClick 
}: TaskListSectionProps) {
  const scrollToTask = (taskId: string) => {
    const taskElement = document.getElementById(`task-${taskId}`);
    if (taskElement) {
      taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a brief highlight effect
      taskElement.classList.add('highlight-task');
      setTimeout(() => {
        taskElement.classList.remove('highlight-task');
      }, 2000);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex">
        <div 
          role="button"
          tabIndex={0}
          onClick={onToggleExpand}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onToggleExpand();
            }
          }}
          className="p-1.5 hover:bg-[#98B5D5]/20 rounded cursor-pointer"
        >
          {isExpanded ? (
            <ChevronDown className="size-4 text-[#3D5A80]" />
          ) : (
            <ChevronRight className="size-4 text-[#3D5A80]" />
          )}
        </div>
        <Button
          variant={isActive ? 'default' : 'ghost'}
          className={`flex-1 justify-start gap-2 text-[#3D5A80] ${
            isActive 
              ? 'bg-[#98B5D5] hover:bg-[#98B5D5]/90' 
              : 'hover:bg-[#98B5D5]/20'
          }`}
          onClick={onClick}
        >
          {title}
          <span className="ml-auto">{count}</span>
        </Button>
      </div>
      
      {isExpanded && tasks.length > 0 && (
        <div className="ml-9 space-y-1">
          {tasks.map(task => (
            <button 
              key={task.id}
              onClick={() => scrollToTask(task.id)}
              className="w-full text-left text-sm text-[#3D5A80] py-1 px-2 rounded-sm hover:bg-[#98B5D5]/10 transition-colors"
            >
              {task.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TaskSidebar() {
  const { tasks, statusFilter, setStatusFilter } = useTasks();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['in-progress']));
  
  const allTasks = tasks;
  const inProgressTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  return (
    <Card className="p-4 space-y-4 w-52 bg-[#E6EEF8] border-[#5C7BA1]">
      <h2 className="font-semibold text-lg text-[#1E3D59]">Tasks</h2>
      <div className="space-y-2">
        <TaskListSection
          title="In Progress"
          count={inProgressTasks.length}
          tasks={inProgressTasks}
          isActive={statusFilter === 'in-progress'}
          isExpanded={expandedSections.has('in-progress')}
          onToggleExpand={() => toggleSection('in-progress')}
          onClick={() => setStatusFilter('in-progress')}
        />
        <TaskListSection
          title="Completed"
          count={completedTasks.length}
          tasks={completedTasks}
          isActive={statusFilter === 'completed'}
          isExpanded={expandedSections.has('completed')}
          onToggleExpand={() => toggleSection('completed')}
          onClick={() => setStatusFilter('completed')}
        />
        <TaskListSection
          title="All Tasks"
          count={allTasks.length}
          tasks={allTasks}
          isActive={statusFilter === 'all'}
          isExpanded={expandedSections.has('all')}
          onToggleExpand={() => toggleSection('all')}
          onClick={() => setStatusFilter('all')}
        />
      </div>
    </Card>
  );
}
