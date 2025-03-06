'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  tasks: Array<{
    id: string;
    title: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
    completed: boolean;
  }>;
}

export function CalendarView({ tasks }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
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
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, date)
      .toISOString()
      .split('T')[0];
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: number, monthOffset: number = 0) => {
    const formattedDate = formatDate(date, monthOffset);
    return tasks.filter(task => task.dueDate === formattedDate);
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
        {weekDays.map((day) => (
          <div key={day} className="p-4 text-center text-xs font-medium text-[#3D5A80]">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-100">
        {/* Previous month days */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => {
          const day = daysInPrevMonth - firstDayOfMonth + i + 1;
          const dayTasks = getTasksForDate(day, -1);
          
          return (
            <div
              key={`prev-${day}`}
              className="p-4 bg-white text-gray-400"
            >
              <div className="flex flex-col min-h-[100px]">
                <span className="text-sm">{day}</span>
                {dayTasks.map(task => (
                  <div
                    key={task.id}
                    className={`mt-1 text-xs p-1 rounded ${
                      task.priority === 'high'
                        ? 'bg-red-500/10 text-red-500'
                        : task.priority === 'medium'
                        ? 'bg-orange-500/10 text-orange-500'
                        : 'bg-green-500/10 text-green-500'
                    } ${task.completed ? 'line-through opacity-50' : ''}`}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Current month days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayTasks = getTasksForDate(day);
          const isToday = 
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={`current-${day}`}
              className={`p-4 bg-white ${
                isToday ? 'bg-[#98B5D5]/5' : ''
              }`}
            >
              <div className="flex flex-col min-h-[100px]">
                <span className={`text-sm ${isToday ? 'font-medium text-[#3D5A80]' : ''}`}>
                  {day}
                </span>
                {dayTasks.map(task => (
                  <div
                    key={task.id}
                    className={`mt-1 text-xs p-1 rounded ${
                      task.priority === 'high'
                        ? 'bg-red-500/10 text-red-500'
                        : task.priority === 'medium'
                        ? 'bg-orange-500/10 text-orange-500'
                        : 'bg-green-500/10 text-green-500'
                    } ${task.completed ? 'line-through opacity-50' : ''}`}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Next month days */}
        {Array.from({ length: 42 - (firstDayOfMonth + daysInMonth) }).map((_, i) => {
          const day = i + 1;
          const dayTasks = getTasksForDate(day, 1);
          
          return (
            <div
              key={`next-${day}`}
              className="p-4 bg-white text-gray-400"
            >
              <div className="flex flex-col min-h-[100px]">
                <span className="text-sm">{day}</span>
                {dayTasks.map(task => (
                  <div
                    key={task.id}
                    className={`mt-1 text-xs p-1 rounded ${
                      task.priority === 'high'
                        ? 'bg-red-500/10 text-red-500'
                        : task.priority === 'medium'
                        ? 'bg-orange-500/10 text-orange-500'
                        : 'bg-green-500/10 text-green-500'
                    } ${task.completed ? 'line-through opacity-50' : ''}`}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}