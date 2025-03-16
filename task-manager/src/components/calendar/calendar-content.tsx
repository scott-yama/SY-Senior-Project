'use client';

import { CalendarView } from "@/components/calendar/calendar-view";
import { TaskSidebar } from "@/components/tasks/task-sidebar";
import { useTasks } from "@/components/tasks/task-context";

function formatDateToMMDDYYYY(dateStr: string) {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

export function CalendarContent() {
  const { tasks } = useTasks();
  
  // Filter out tasks without due dates and format them for the calendar
  const calendarTasks = tasks.filter(task => task.dueDate).map(task => ({
    ...task,
    dueDate: formatDateToMMDDYYYY(task.dueDate)
  }));

  console.log('Calendar tasks with MM/DD/YYYY format:', calendarTasks);
  
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