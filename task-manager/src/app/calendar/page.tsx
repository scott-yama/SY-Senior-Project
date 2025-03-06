'use client';

import { Navbar } from "@/components/layout/navbar";
import { CalendarView } from "@/components/calendar/calendar-view";
import { TaskSidebar } from "@/components/tasks/task-sidebar";
import { TaskProvider, useTasks } from "@/components/tasks/task-context";

function CalendarContent() {
  const { tasks } = useTasks();
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 p-6 flex gap-6">
        <TaskSidebar />
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-[#1E3D59] mb-6">Calendar View</h1>
          <div className="w-full overflow-auto">
            <CalendarView tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <TaskProvider>
      <CalendarContent />
    </TaskProvider>
  );
} 