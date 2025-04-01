'use client';

import { Navbar } from "@/components/layout/navbar";
import { TaskList } from "@/components/tasks/task-list";
import { TaskSidebar } from "@/components/tasks/task-sidebar";
import { AddTaskForm } from "@/components/tasks/add-task-form";
import { PriorityFilters } from "@/components/tasks/priority-filters";
import { TaskProvider } from "@/components/tasks/task-context";
import { PriorityFilter } from "../components/tasks/priority-filter";

function HomeContent() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1 gap-6 p-6">
        <TaskSidebar />
        <main className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">All Tasks</h1>
            <AddTaskForm />
          </div>
          <PriorityFilter />
          <TaskList />
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <TaskProvider>
      <HomeContent />
    </TaskProvider>
  );
}
