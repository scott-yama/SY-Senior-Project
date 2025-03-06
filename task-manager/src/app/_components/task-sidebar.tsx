import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  count: number;
  isActive?: boolean;
}

export function TaskSidebar() {
  const categories: Category[] = [
    { id: "today", name: "Today", count: 1 },
    { id: "upcoming", name: "Upcoming", count: 1, isActive: true },
    { id: "completed", name: "Completed", count: 3 }
  ];

  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-4 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center justify-between py-2">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <Badge variant="secondary">5 Total</Badge>
          </div>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={category.isActive ? "secondary" : "ghost"}
              className="w-full justify-between"
              size="sm"
            >
              <span>{category.name}</span>
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
} 