import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddTaskFormProps {
  onAdd: (title: string, description?: string) => void;
  isLoading: boolean;
}

const AddTaskForm = ({ onAdd, isLoading }: AddTaskFormProps) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={isLoading || !title.trim()}>
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default AddTaskForm;
