import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ReportCards() {
  const { data: conflictsByType } = useQuery({
    queryKey: ["/api/reports/conflicts-by-type"],
    queryFn: () => api.getConflictsByType(),
  });

  const { data: conflictsByCasualties } = useQuery({
    queryKey: ["/api/reports/conflicts-by-casualties"],
    queryFn: () => api.getConflictsByCasualties(),
  });

  const { data: groupsByWeapons } = useQuery({
    queryKey: ["/api/reports/groups-by-weapons"],
    queryFn: () => api.getGroupsByWeapons(),
  });

  const { data: weaponTrafficking } = useQuery({
    queryKey: ["/api/reports/weapon-trafficking"],
    queryFn: () => api.getWeaponTrafficking(),
  });

  const { data: religiousConflicts } = useQuery({
    queryKey: ["/api/reports/religious-conflicts"],
    queryFn: () => api.getReligiousConflicts(),
  });

  const { data: activeMediators } = useQuery({
    queryKey: ["/api/reports/active-mediators"],
    queryFn: () => api.getActiveMediators(),
  });

  const { data: weaponsByPower } = useQuery({
    queryKey: ["/api/reports/weapons-by-power"],
    queryFn: () => api.getWeaponsByPower(),
  });

  const { data: divisionResources } = useQuery({
    queryKey: ["/api/reports/division-resources"],
    queryFn: () => api.getDivisionResources(),
  });

  return (
    <div className="p-6 space-y-6">
      {/* First Row - Main Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report 1: Conflicts by Type */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle>Relatório 1: Conflitos por Tipo</CardTitle>
            <p className="text-sm text-slate-500">Distribuição de conflitos por causa</p>
          </CardHeader>
          <CardContent>
            <div className="h-48 mb-4">
              {conflictsByType && conflictsByType.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conflictsByType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="causa" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(207, 90%, 54%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  Carregando dados...
                </div>
              )}
            </div>
            <div className="space-y-2">
              {conflictsByType?.map((item) => (
                <div key={item.causa} className="flex justify-between text-sm">
                  <span className="text-slate-600 capitalize">{item.causa}:</span>
                  <span className="font-medium">{item.count} conflitos</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report 2: Conflicts by Casualties */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle>Relatório 2: Conflitos por Baixas</CardTitle>
            <p className="text-sm text-slate-500">Número de baixas por conflito</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conflictsByCasualties?.slice(0, 5).map((conflict: any) => (
                <div key={conflict.nome} className="flex justify-between">
                  <span className="text-slate-600">{conflict.nome}</span>
                  <span className="font-medium">{conflict.totalbaixas?.toLocaleString()} baixas</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Additional Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="fade-in">
          <CardHeader>
            <CardTitle>Relatório 3: Mediação</CardTitle>
            <p className="text-sm text-slate-500">Quantidade de conflitos mediados</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeMediators?.slice(0, 5).map((org) => (
                <div key={org.nome} className="flex justify-between">
                  <span className="text-slate-600">{org.nome}</span>
                  <span className="font-medium">{org.participacoes} conflitos</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="fade-in">
          <CardHeader>
            <CardTitle>Relatório 4: Grupos por Armas</CardTitle>
            <p className="text-sm text-slate-500">Quantidade de armas</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {groupsByWeapons?.slice(0, 5).map((group: any) => (
                <div key={group.nome} className="flex justify-between">
                  <span className="text-slate-600">{group.nome}</span>
                  <span className="font-medium">{group.totalarmas} armas</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="fade-in">
          <CardHeader>
            <CardTitle>Relatório 5: Tráfico de Armas</CardTitle>
            <p className="text-sm text-slate-500">Traficantes que fornecem Barret M82 ou M200 Intervention</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weaponTrafficking?.slice(0, 5).map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span className="text-slate-600">{item.traficante}</span>
                  <span className="font-medium">{item.grupo}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Religious Conflicts by Country */}
      <Card className="fade-in">
        <CardHeader>
          <CardTitle>Relatório 6: Países por Conflitos Religiosos</CardTitle>
          <p className="text-sm text-slate-500">Ranking de países com conflitos religiosos</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {religiousConflicts?.slice(0, 5).map((country: any) => (
              <div key={country.pais} className="flex justify-between">
                <span className="text-slate-600">{country.pais}</span>
                <span className="font-medium">{country.conflitos} conflitos</span>
              </div>
            ))}
            {(!religiousConflicts || religiousConflicts.length === 0) && (
              <div className="text-center py-4 text-slate-500">
                Nenhum conflito religioso registrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
