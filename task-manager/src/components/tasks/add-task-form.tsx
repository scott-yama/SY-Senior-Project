'use client';

import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useTasks } from "./task-context";

interface FormData {
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low" | "";
}

interface FormErrors {
  title?: string;
  dueDate?: string;
  priority?: string;
}

export function AddTaskForm() {
  const { addTask } = useTasks();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    dueDate: new Date().toISOString().split('T')[0], // Set today as default date
    priority: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    
    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Add the task with the formatted date
      addTask({
        title: formData.title,
        dueDate: formData.dueDate,
        priority: formData.priority as "high" | "medium" | "low",
      });

      // Reset form and close modal
      setFormData({
        title: "",
        dueDate: new Date().toISOString().split('T')[0],
        priority: "",
      });
      setIsOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-[#3D5A80] hover:bg-[#5C7BA1] text-white"
      >
        <PlusIcon className="size-4 mr-2" />
        Add Task
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-[#1E3D59]/50 flex items-center justify-center z-50">
          <div className="bg-[#E6EEF8] rounded-lg p-6 w-[425px] space-y-4 shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[#1E3D59]">Add New Task</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="text-[#1E3D59] hover:text-[#3D5A80] hover:bg-[#98B5D5]/20"
              >
                <XIcon className="size-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1E3D59]">
                  Title
                </label>
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  className="w-full px-3 py-2 border border-[#5C7BA1] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#3D5A80] text-[#1E3D59]"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1E3D59]">
                  Due Date
                </label>
                <input
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#5C7BA1] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#3D5A80] text-[#1E3D59]"
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm">{errors.dueDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1E3D59]">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#5C7BA1] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#3D5A80] text-[#1E3D59]"
                >
                  <option value="">Select priority</option>
                  <option value="high" className="text-red-500">High</option>
                  <option value="medium" className="text-orange-500">Medium</option>
                  <option value="low" className="text-green-500">Low</option>
                </select>
                {errors.priority && (
                  <p className="text-red-500 text-sm">{errors.priority}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="border-[#3D5A80] text-[#3D5A80] hover:bg-[#98B5D5]/20"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-[#3D5A80] hover:bg-[#5C7BA1] text-white"
                >
                  Create Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 