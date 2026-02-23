import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Task } from "@/hooks/useTasks";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, is_complete: boolean) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  return (
    <div className="group flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-all hover:shadow-sm animate-fade-in">
      <Checkbox
        checked={task.is_complete}
        onCheckedChange={(checked) => onToggle(task.id, !!checked)}
        className="h-5 w-5"
      />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium leading-tight transition-colors", task.is_complete && "line-through text-muted-foreground")}>
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 text-xs text-muted-foreground truncate">{task.description}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TaskItem;
