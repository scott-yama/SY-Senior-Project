'use client';

import { Navbar } from "@/components/layout/navbar";
import { CalendarContent } from "@/components/calendar/calendar-content";
import { TaskProvider } from "@/components/tasks/task-context";

export default function CalendarPage() {
  return (
    <TaskProvider>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <CalendarContent />
      </div>
    </TaskProvider>
  );
} 