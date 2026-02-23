import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Task[];
    },
    enabled: !!user,
  });

  const addTask = useMutation({
    mutationFn: async ({ title, description }: { title: string; description?: string }) => {
      const { error } = await supabase
        .from("tasks")
        .insert({ title, description: description || null, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const toggleTask = useMutation({
    mutationFn: async ({ id, is_complete }: { id: string; is_complete: boolean }) => {
      const { error } = await supabase.from("tasks").update({ is_complete }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return { tasks: tasksQuery.data ?? [], isLoading: tasksQuery.isLoading, addTask, toggleTask, deleteTask };
};
