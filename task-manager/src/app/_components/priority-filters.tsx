import { Button } from "@/components/ui/button";

export function PriorityFilters() {
  const filters = [
    { id: "all", label: "All Tasks" },
    { id: "high", label: "High Priority", color: "text-destructive" },
    { id: "medium", label: "Medium Priority", color: "text-yellow-500" },
    { id: "low", label: "Low Priority", color: "text-green-500" }
  ];

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant="outline"
          size="sm"
          className={`text-sm ${filter.color || ""}`}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
} 