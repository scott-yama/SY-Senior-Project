function formatDate(date: string | Date) {
  const d = new Date(date);
  // Pad with leading zeros and format as mm/dd/yyyy
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return `${month}/${day}/${year}`;
}

interface TodoItemProps {
  todo: {
    dueDate?: string | Date;
  }
}

function TodoItem({ todo }: TodoItemProps) {
  // ... existing code ...

  return (
    <div className="flex items-center justify-between">
      {/* ... other todo item content ... */}
      <div className="text-sm text-muted-foreground">
        Due: {todo.dueDate ? formatDate(todo.dueDate) : 'No due date'}
      </div>
    </div>
  );
} 