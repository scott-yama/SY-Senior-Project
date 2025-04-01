'use client';

import { CalendarView } from "@/components/calendar/calendar-view";
import { TaskSidebar } from "@/components/tasks/task-sidebar";
import { useTasks } from "@/components/tasks/task-context";

export function CalendarContent() {
  const { tasks } = useTasks();
  
  // Filter out tasks without due dates
  const calendarTasks = tasks.filter(task => task.due_date);
  
  return (
    <div className="flex-1 p-6 flex gap-6">
      <TaskSidebar />
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-[#1E3D59] mb-6">Calendar View</h1>
        <div className="w-full overflow-auto">
          <CalendarView tasks={calendarTasks} />
        </div>
      </div>
    </div>
  );
} 