'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTasks } from "@/components/tasks/task-context";

interface CalendarProps {
  tasks: Array<{
    id: string;
    title: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
    completed: boolean;
  }>;
}

export function CalendarView({ tasks: propTasks }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { toggleTask } = useTasks();
  
  const tasks = propTasks; // Use only the real tasks
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Get days in current month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Get days in previous month
  const daysInPrevMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  ).getDate();

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // Format date for comparison with task dates
  const formatDate = (date: number, monthOffset: number = 0) => {
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      date
    );
    
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(date).padStart(2, '0');
    const year = targetDate.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    console.log('Formatting date:', formattedDate);
    return formattedDate;
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: number, monthOffset: number = 0) => {
    const formattedDate = formatDate(date, monthOffset);
    console.log('Looking for tasks on date:', formattedDate);
    const dayTasks = tasks.filter(task => {
      const matches = task.dueDate === formattedDate;
      console.log(`Comparing task date ${task.dueDate} with ${formattedDate}, matches: ${matches}`);
      return matches;
    });
    console.log('Found tasks:', dayTasks);
    return dayTasks;
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-700 border-l-4 border-red-500";
      case "medium":
        return "bg-orange-500/20 text-orange-700 border-l-4 border-orange-500";
      case "low":
        return "bg-green-500/20 text-green-700 border-l-4 border-green-500";
      default:
        return "";
    }
  };

  const formatTaskTime = (date: string) => {
    // For MM/DD/YYYY format
    const [month, day, year] = date.split('/');
    const taskDate = new Date(Number(year), Number(month) - 1, Number(day));
    return taskDate.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: 'numeric',
      hour12: true 
    });
  };

  // Update the task rendering to remove due date and add click handler
  const renderTask = (task: CalendarProps['tasks'][0], dayId: string) => (
    <div
      key={`${dayId}-task-${task.id}`}
      onClick={() => toggleTask(task.id)}
      className={`mb-0.5 text-xs p-1.5 rounded-md ${getPriorityStyles(task.priority)} 
        ${task.completed ? 'opacity-50' : ''} hover:opacity-90 transition-opacity cursor-pointer`}
    >
      <div className="flex items-center gap-1">
        <div className="w-full truncate">
          <div className={`font-medium truncate ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </div>
        </div>
      </div>
    </div>
  );

  // Update the day cell to accommodate more tasks
  const renderDayCell = (day: number, tasks: CalendarProps['tasks'], monthType: 'prev' | 'current' | 'next', isToday: boolean = false) => {
    const dayId = `${monthType}-${day}`;
    const isCurrentMonth = monthType === 'current';
    const dayTasks = getTasksForDate(day, monthType === 'prev' ? -1 : monthType === 'next' ? 1 : 0);
    
    return (
      <div
        key={dayId}
        className={`relative p-1.5 bg-white ${
          isToday ? 'bg-[#98B5D5]/5' : ''
        } ${!isCurrentMonth ? 'text-gray-400' : ''}`}
      >
        <div className="flex flex-col min-h-[120px]">
          <span className={`text-sm mb-1 ${
            isToday ? 'font-medium text-[#3D5A80] bg-[#98B5D5]/20 w-6 h-6 rounded-full flex items-center justify-center' : ''
          }`}>
            {day}
          </span>
          <div className="space-y-0.5 overflow-y-auto max-h-[100px] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {dayTasks.map(task => renderTask(task, dayId))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1E3D59]">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              variant="outline"
              size="sm"
              className="border-[#3D5A80] text-[#3D5A80]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              variant="outline"
              size="sm"
              className="border-[#3D5A80] text-[#3D5A80]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {weekDays.map((day, index) => (
          <div key={`weekday-${index}`} className="p-2 text-center text-xs font-medium text-[#3D5A80] border-b">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-100">
        {/* Previous month days */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => {
          const day = daysInPrevMonth - firstDayOfMonth + i + 1;
          const dayTasks = getTasksForDate(day, -1);
          return renderDayCell(day, dayTasks, 'prev');
        })}

        {/* Current month days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayTasks = getTasksForDate(day);
          const isToday = 
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();
          return renderDayCell(day, dayTasks, 'current', isToday);
        })}

        {/* Next month days */}
        {Array.from({ length: 42 - (firstDayOfMonth + daysInMonth) }).map((_, i) => {
          const day = i + 1;
          const dayTasks = getTasksForDate(day, 1);
          return renderDayCell(day, dayTasks, 'next');
        })}
      </div>
    </div>
  );
}