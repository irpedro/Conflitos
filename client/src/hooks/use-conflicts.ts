import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Conflito, InsertConflito } from "@shared/schema";

export function useConflicts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const conflictsQuery = useQuery({
    queryKey: ["/api/conflicts"],
    queryFn: () => api.getConflicts(),
  });

  const createConflictMutation = useMutation({
    mutationFn: (conflict: InsertConflito) => api.createConflict(conflict),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conflicts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reports/conflicts-by-type"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reports/conflicts-by-region"] });
      toast({
        title: "Conflito criado",
        description: "O conflito foi cadastrado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar conflito",
        description: error.details || "Ocorreu um erro ao cadastrar o conflito.",
        variant: "destructive",
      });
    },
  });

  const updateConflictMutation = useMutation({
    mutationFn: ({ id, conflict }: { id: string; conflict: Partial<InsertConflito> }) =>
      api.updateConflict(id, conflict),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conflicts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      toast({
        title: "Conflito atualizado",
        description: "O conflito foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar conflito",
        description: error.details || "Ocorreu um erro ao atualizar o conflito.",
        variant: "destructive",
      });
    },
  });

  const deleteConflictMutation = useMutation({
    mutationFn: (id: string) => api.deleteConflict(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conflicts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      toast({
        title: "Conflito excluído",
        description: "O conflito foi excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir conflito",
        description: error.details || "Ocorreu um erro ao excluir o conflito.",
        variant: "destructive",
      });
    },
  });

  return {
    conflicts: conflictsQuery.data || [],
    isLoading: conflictsQuery.isLoading,
    isError: conflictsQuery.isError,
    error: conflictsQuery.error,
    createConflict: createConflictMutation.mutate,
    updateConflict: updateConflictMutation.mutate,
    deleteConflict: deleteConflictMutation.mutate,
    isCreating: createConflictMutation.isPending,
    isUpdating: updateConflictMutation.isPending,
    isDeleting: deleteConflictMutation.isPending,
  };
}

export function useConflictById(id: string) {
  return useQuery({
    queryKey: ["/api/conflicts", id],
    queryFn: () => api.getConflictById(id),
    enabled: !!id,
  });
}

export function useConflictStatistics() {
  return useQuery({
    queryKey: ["/api/statistics"],
    queryFn: () => api.getStatistics(),
  });
}

export function useConflictsByType() {
  return useQuery({
    queryKey: ["/api/reports/conflicts-by-type"],
    queryFn: () => api.getConflictsByType(),
  });
}

export function useConflictsByRegion() {
  return useQuery({
    queryKey: ["/api/reports/conflicts-by-region"],
    queryFn: () => api.getConflictsByRegion(),
  });
}
