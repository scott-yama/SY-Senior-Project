import { Button } from "@/components/ui/button";

export function PriorityFilters() {
  const priorities = ["All", "High", "Medium", "Low"];

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-500 hover:text-red-600 hover:border-red-500";
      case "Medium":
        return "text-orange-500 hover:text-orange-600 hover:border-orange-500";
      case "Low":
        return "text-green-500 hover:text-green-600 hover:border-green-500";
      default:
        return "";
    }
  };

  return (
    <div className="flex gap-2">
      {priorities.map((priority) => (
        <Button
          key={priority}
          variant={priority === "All" ? "default" : "outline"}
          size="sm"
          className={priority !== "All" ? getPriorityStyles(priority) : ""}
        >
          {priority}
        </Button>
      ))}
    </div>
  );
} 