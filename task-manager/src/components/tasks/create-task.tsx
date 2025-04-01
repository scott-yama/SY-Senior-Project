// When creating a task, ensure due_date is included and properly formatted
const handleCreateTask = async (data: TaskFormData) => {
  try {
    const newTask = {
      title: data.title,
      due_date: data.due_date, // Make sure this is in YYYY-MM-DD format
      priority: data.priority,
      completed: false
    };
    
    // Create task logic here...
  } catch (error) {
    toast.error("Failed to create task");
  }
}; 