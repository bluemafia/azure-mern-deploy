import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import TaskItem from "@/components/TaskItem";
import AddTaskForm from "@/components/AddTaskForm";
import { Button } from "@/components/ui/button";
import { CheckSquare, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { tasks, isLoading, addTask, toggleTask, deleteTask } = useTasks();
  const { toast } = useToast();

  const completedCount = tasks.filter((t) => t.is_complete).length;
  const pendingTasks = tasks.filter((t) => !t.is_complete);
  const completedTasks = tasks.filter((t) => t.is_complete);

  const handleAdd = (title: string) => {
    addTask.mutate({ title }, {
      onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  const handleToggle = (id: string, is_complete: boolean) => {
    toggleTask.mutate({ id, is_complete });
  };

  const handleDelete = (id: string) => {
    deleteTask.mutate(id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <CheckSquare className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Taskflow</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={signOut} className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Your Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {tasks.length === 0
              ? "No tasks yet. Add one below!"
              : `${completedCount} of ${tasks.length} completed`}
          </p>
        </div>

        <div className="mb-6">
          <AddTaskForm onAdd={handleAdd} isLoading={addTask.isPending} />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
            {completedTasks.length > 0 && (
              <>
                <p className="pt-4 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Completed
                </p>
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
                ))}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
