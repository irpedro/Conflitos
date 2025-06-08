import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Save, Trash, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function SqlEditor() {
  const [query, setQuery] = useState(`SELECT c.nome, c.lugar, c.total_mortos, c.causa
FROM conflito c
WHERE c.total_mortos > 50000
ORDER BY c.total_mortos DESC;`);
  
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [executionInfo, setExecutionInfo] = useState<{
    executionTime: string;
    rowCount: number;
  } | null>(null);

  const { toast } = useToast();

  const executeQueryMutation = useMutation({
    mutationFn: (sqlQuery: string) => api.executeQuery(sqlQuery),
    onSuccess: (data) => {
      setQueryResults(data.results || []);
      setExecutionInfo({
        executionTime: data.executionTime || '0.0s',
        rowCount: data.rowCount || 0
      });
      toast({
        title: "Consulta executada",
        description: `${data.rowCount || 0} registros retornados`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na consulta",
        description: error.details || "Falha na execução da consulta SQL",
        variant: "destructive",
      });
    },
  });

  const handleExecuteQuery = () => {
    if (!query.trim()) {
      toast({
        title: "Consulta vazia",
        description: "Digite uma consulta SQL para executar",
        variant: "destructive",
      });
      return;
    }
    executeQueryMutation.mutate(query);
  };

  const handleSaveQuery = () => {
    toast({
      title: "Consulta salva",
      description: "A consulta foi salva com sucesso",
    });
  };

  const handleClearQuery = () => {
    setQuery("");
    setQueryResults([]);
    setExecutionInfo(null);
  };

  const savedQueries = [
    {
      name: "Conflitos por Região",
      description: "Lista conflitos agrupados por localização",
      date: "15/01/2024",
      query: "SELECT lugar, COUNT(*) as total FROM conflito GROUP BY lugar ORDER BY total DESC;"
    },
    {
      name: "Grupos Mais Ativos",
      description: "Ranking de grupos por participação",
      date: "12/01/2024", 
      query: "SELECT ga.nome, ga.numero_baixas FROM grupo_armado ga ORDER BY ga.numero_baixas DESC;"
    }
  ];

  const renderTable = () => {
    if (!queryResults || queryResults.length === 0) {
      return (
        <div className="text-center py-8 text-slate-500">
          Execute uma consulta para ver os resultados
        </div>
      );
    }

    const columns = Object.keys(queryResults[0] || {});
    
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="font-medium text-slate-600 uppercase text-xs tracking-wider">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {queryResults.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column} className="text-sm">
                    {row[column]?.toString() || ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Query Editor */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle>Editor de Consultas SQL</CardTitle>
            <p className="text-sm text-slate-500">Execute consultas personalizadas no banco</p>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Consulta SQL</label>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-32 font-mono text-sm resize-none"
                placeholder="Digite sua consulta SQL aqui..."
              />
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={handleExecuteQuery}
                disabled={executeQueryMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {executeQueryMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Executar
              </Button>
              <Button onClick={handleClearQuery} variant="outline">
                <Trash className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Saved Queries */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle>Consultas Salvas</CardTitle>
            <p className="text-sm text-slate-500">Suas consultas mais utilizadas</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {savedQueries.map((savedQuery, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800">{savedQuery.name}</h4>
                      <p className="text-sm text-slate-500 mt-1">{savedQuery.description}</p>
                      <div className="text-xs text-slate-400 mt-2">Criado em {savedQuery.date}</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setQuery(savedQuery.query)}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Query Results */}
      <Card className="mt-6 fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Resultados da Consulta</CardTitle>
            <div className="flex items-center text-sm text-slate-500">
              {executeQueryMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              <span>
                {executionInfo 
                  ? `${executionInfo.rowCount} registros encontrados em ${executionInfo.executionTime}`
                  : "Execute uma consulta para ver os resultados"
                }
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderTable()}
        </CardContent>
      </Card>
    </div>
  );
}
