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
type StatusFilter = 'all' | 'in-progress' | 'completed';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  selectedPriorities: Set<Priority>;
  statusFilter: StatusFilter;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (taskId: string) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  togglePriorityFilter: (priority: Priority) => void;
  setStatusFilter: (status: StatusFilter) => void;
  updateTaskOrder: (newOrder: Task[]) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete Senior Project',
      dueDate: '2024-03-20',
      priority: 'high',
      completed: false,
    },
    {
      id: '2',
      title: 'Review Team Updates',
      dueDate: '2024-03-21',
      priority: 'medium',
      completed: false,
    },
    {
      id: '3',
      title: 'Submit Project Proposal',
      dueDate: '2024-03-25',
      priority: 'high',
      completed: false,
    },
    {
      id: '4',
      title: 'Schedule Team Meeting',
      dueDate: '2024-03-19',
      priority: 'low',
      completed: true,
    },
    {
      id: '5',
      title: 'Update Documentation',
      dueDate: '2024-03-22',
      priority: 'medium',
      completed: false,
    }
  ]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('in-progress');
  const [selectedPriorities, setSelectedPriorities] = useState<Set<Priority>>(new Set<Priority>(['all']));

  // Add console log to verify tasks are loaded
  console.log('TaskProvider tasks:', tasks);

  const filteredTasks = tasks.filter(task => {
    // First filter by status
    if (statusFilter === 'in-progress') {
      if (task.completed) return false;
    } else if (statusFilter === 'completed') {
      if (!task.completed) return false;
    }

    // Then filter by priority
    if (selectedPriorities.has('all')) {
      return true;
    }
    return selectedPriorities.has(task.priority);
  });
  const togglePriorityFilter = (priority: Priority) => {
    setSelectedPriorities((prev: Set<Priority>) => {
      const next = new Set<Priority>(prev);
      
      if (priority === 'all') {
        return new Set<Priority>(['all']);
      } else {
        next.delete('all');
        
        if (next.has(priority)) {
          next.delete(priority);
          if (next.size === 0) {
            return new Set<Priority>(['all']);
          }
        } else {
          next.add(priority);
        }
      }
      return next;
    });
  };

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
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
      prev.map(task =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const updateTaskOrder = (newOrder: Task[]) => {
    setTasks(newOrder);
  };

  return (
    <TaskContext.Provider 
      value={{ 
        tasks, 
        filteredTasks,
        selectedPriorities,
        statusFilter,
        addTask, 
        toggleTask, 
        updateTask, 
        deleteTask,
        togglePriorityFilter,
        setStatusFilter,
        updateTaskOrder
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