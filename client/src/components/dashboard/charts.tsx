import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "hsl(207, 90%, 54%)",
  "hsl(0, 84%, 60%)",
  "hsl(36, 91%, 55%)",
  "hsl(142, 71%, 45%)",
];

export default function Charts() {
  const { data: conflictsByType } = useQuery({
    queryKey: ["/api/reports/conflicts-by-type"],
    queryFn: () => api.getConflictsByType(),
  });

  const { data: conflictsByRegion } = useQuery({
    queryKey: ["/api/reports/conflicts-by-region"],
    queryFn: () => api.getConflictsByRegion(),
  });

  const { data: conflicts } = useQuery({
    queryKey: ["/api/conflicts"],
    queryFn: () => api.getConflicts(),
  });

  const getCauseColor = (causa: string) => {
    switch (causa) {
      case "religioso":
        return "bg-red-100 text-red-800";
      case "territorial":
        return "bg-blue-100 text-blue-800";
      case "econômico":
        return "bg-green-100 text-green-800";
      case "racial":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conflict Types Chart */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle>Tipos de Conflito</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {conflictsByType && conflictsByType.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={conflictsByType}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ causa, count }) => `${causa}: ${count}`}
                      labelLine={false}
                    >
                      {conflictsByType.map((item: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value} conflitos`,
                        props.payload.causa,
                      ]}
                      labelFormatter={() => ""}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  Carregando dados...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle>Distribuição Regional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {conflictsByRegion && conflictsByRegion.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conflictsByRegion} margin={{ bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="lugar"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        `${value} conflitos`,
                        "Quantidade",
                      ]}
                      labelFormatter={(label) => `País: ${label}`}
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(207, 90%, 54%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  Carregando dados...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conflicts Table */}
      <Card className="fade-in">
        <CardHeader>
          <CardTitle>Conflitos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {conflicts && conflicts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conflito</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Mortos</TableHead>
                    <TableHead>Feridos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conflicts.slice(0, 10).map((conflict: any) => (
                    <TableRow key={conflict.id}>
                      <TableCell className="font-medium">
                        {conflict.nome}
                      </TableCell>
                      <TableCell>{conflict.lugar}</TableCell>
                      <TableCell>
                        <Badge className={getCauseColor(conflict.causa)}>
                          {conflict.causa}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {conflict.totalMortos.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {conflict.totalFeridos.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              Nenhum conflito encontrado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
