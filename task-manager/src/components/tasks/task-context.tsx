'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

type Priority = Task['priority'] | 'all';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  selectedPriorities: Set<Priority>;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (taskId: string) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  togglePriorityFilter: (priority: Priority) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project proposal",
      dueDate: "2024-03-20",
      priority: "high",
      completed: false,
    },
    {
      id: "2",
      title: "Review team updates",
      dueDate: "2024-03-21",
      priority: "medium",
      completed: false,
    },
  ]);
  
  const [selectedPriorities, setSelectedPriorities] = useState<Set<Priority>>(() => 
    new Set<Priority>(['all'])
  );

  const filteredTasks = tasks.filter(task => {
    if (selectedPriorities.has('all')) return true;
    return selectedPriorities.has(task.priority);
  });

  const togglePriorityFilter = (priority: Priority) => {
    setSelectedPriorities(prev => {
      const next = new Set(prev);
      
      if (priority === 'all') {
        // If 'all' is being toggled
        if (next.has('all')) {
          next.delete('all');
        } else {
          next.clear();
          next.add('all');
        }
      } else {
        // If a specific priority is being toggled
        if (next.has('all')) {
          next.delete('all');
          next.add(priority);
        } else {
          if (next.has(priority)) {
            next.delete(priority);
            // If no priorities are selected, select 'all'
            if (next.size === 0) next.add('all');
          } else {
            next.add(priority);
          }
        }
      }
      
      return next;
    });
  };

  const addTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const updateTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks(prev =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <TaskContext.Provider 
      value={{ 
        tasks, 
        filteredTasks,
        selectedPriorities,
        addTask, 
        toggleTask, 
        updateTask, 
        deleteTask,
        togglePriorityFilter
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
} 