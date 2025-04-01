import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
}

export function TaskList() {
  const tasks: Task[] = [
    {
      id: "1",
      title: "Complete Project Proposal",
      dueDate: "March 20, 2024",
      priority: "high"
    },
    {
      id: "2",
      title: "Study for Midterm",
      dueDate: "March 25, 2024",
      priority: "medium"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{task.title}</h3>
            <Badge 
              variant="outline" 
              className={
                task.priority === "high" ? "text-destructive" :
                task.priority === "medium" ? "text-yellow-500" :
                "text-green-500"
              }
            >
              {task.priority}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Due: {task.dueDate}</p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm">Edit</Button>
            <Button variant="destructive" size="sm">Delete</Button>
          </div>
        </Card>
      ))}
    </div>
  );
} 