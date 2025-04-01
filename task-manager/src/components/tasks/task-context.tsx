'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import supabase from '@/config/supabaseClient';
import { toast } from 'react-hot-toast';

export interface Task {
  id: string;           // UUID
  title: string;        // TEXT NOT NULL
  due_date: string;     // DATE
  priority: "low" | "medium" | "high";  // TEXT with CHECK constraint
  completed: boolean;   // BOOLEAN DEFAULT FALSE
  created_at?: string; // TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  updated_at?: string; // TIMESTAMP WITH TIME ZONE DEFAULT NOW()
}

type Priority = Task['priority'] | 'all';
type StatusFilter = 'all' | 'in-progress' | 'completed';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  selectedPriorities: Set<Priority>;
  statusFilter: StatusFilter;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  togglePriorityFilter: (priority: Priority) => void;
  setStatusFilter: (status: StatusFilter) => void;
  updateTaskOrder: (newOrder: Task[]) => void;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('in-progress');
  const [selectedPriorities, setSelectedPriorities] = useState<Set<Priority>>(new Set<Priority>(['all']));

  // Fetch tasks from Supabase on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching tasks:', error);
          return;
        }
        
        // Transform the data to match our Task interface
        const formattedTasks: Task[] = data.map((task: any) => {
          // Format the date properly to prevent timezone issues
          let dueDate = task.due_date;
          
          // If due_date exists, format it as MM/DD/YYYY
          if (dueDate) {
            // Create a date object with the time set to noon to avoid timezone issues
            const date = new Date(dueDate + 'T12:00:00');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const year = date.getFullYear();
            dueDate = `${month}/${day}/${year}`;
          }
          
          return {
            id: task.id,
            title: task.title,
            due_date: dueDate,
            priority: task.priority,
            completed: task.completed,
          };
        });
        
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Error in fetchTasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
    
    // Setup realtime subscription
    const tasksSubscription = supabase
      .channel('tasks-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        console.log('Change received:', payload);
        fetchTasks(); // Refetch tasks when changes occur
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(tasksSubscription);
    };
  }, []);

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

  const addTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    try {
      console.log('Received task data:', task); // Debug log
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          { 
            title: task.title,
            due_date: task.due_date, // This will now receive the correct property name
            priority: task.priority,
            completed: false
          }
        ])
        .select();
        
      if (error) {
        console.error('Error adding task:', error.message);
        toast.error("Failed to create task");
        return;
      }
      
      console.log('Task added successfully:', data);
      toast.success("Task created successfully");
      
    } catch (error) {
      console.error('Error in addTask:', error);
      toast.error("Failed to create task");
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      // Find the current task
      const taskToToggle = tasks.find(task => task.id === taskId);
      if (!taskToToggle) return;
      
      // Update the task in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !taskToToggle.completed })
        .eq('id', taskId);
        
      if (error) {
        console.error('Error toggling task:', error);
        return;
      }
      
      // Optimistic UI update
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.error('Error in toggleTask:', error);
    }
  };

  const updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      const dbTask: any = {};
      
      if (updatedTask.title) dbTask.title = updatedTask.title;
      
      // Handle date format conversion for due_date
      if (updatedTask.due_date) {
        // Check if the date is in MM/DD/YYYY format
        if (updatedTask.due_date.includes('/')) {
          const [month, day, year] = updatedTask.due_date.split('/');
          if (month && day && year) {
            dbTask.due_date = `${year}-${month}-${day}`;
          } else {
            throw new Error('Invalid date format');
          }
        } else {
          // If it's already in YYYY-MM-DD format, use it directly
          dbTask.due_date = updatedTask.due_date;
        }
      }
      
      if (updatedTask.priority) dbTask.priority = updatedTask.priority;
      if (updatedTask.completed !== undefined) dbTask.completed = updatedTask.completed;
      
      console.log('Updating task with data:', dbTask); // Debug log
      
      const { error } = await supabase
        .from('tasks')
        .update(dbTask)
        .eq('id', taskId);
        
      if (error) {
        console.error('Error updating task:', error);
        throw error; // Throw error to be caught in catch block
      }
      
      // Only update local state if Supabase update was successful
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        )
      );
    } catch (error) {
      console.error('Error in updateTask:', error);
      throw error; // Propagate error to component
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      console.log('Attempting to delete task:', taskId);

      // Attempt to delete from Supabase
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) {
        console.error('Error deleting task:', error);
        throw error;
      }

      // Only update local state if Supabase delete was successful
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
    } catch (error) {
      console.error('Error in deleteTask:', error);
      throw error;
    }
  };

  const updateTaskOrder = (newOrder: Task[]) => {
    // For now, just update the local state
    // You could implement order persistence in Supabase if needed
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
        updateTaskOrder,
        isLoading
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