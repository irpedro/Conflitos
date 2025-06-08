import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Shield, Skull, Building2 } from "lucide-react";
import { api } from "@/lib/api";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/statistics"],
    queryFn: () => api.getStatistics(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Erro ao carregar estatísticas</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total de Conflitos",
      value: stats.totalConflicts.toLocaleString(),
      icon: Zap,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      change: "+2",
      changeLabel: "nos últimos dados"
    },
    {
      title: "Grupos Armados",
      value: stats.totalArmedGroups.toLocaleString(),
      icon: Shield,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      changeLabel: "Ativos no sistema"
    },
    {
      title: "Total de Mortos",
      value: stats.totalDeaths.toLocaleString(),
      icon: Skull,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-600",
      changeLabel: "Vítimas registradas"
    },
    {
      title: "Org. Mediadoras",
      value: stats.totalMediatorOrgs.toLocaleString(),
      icon: Building2,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      change: "Ativas",
      changeLabel: "em mediações"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${stat.iconColor} w-6 h-6`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                {stat.change && (
                  <span className="text-red-600 font-medium">{stat.change}</span>
                )}
                <span className={`text-slate-500 ${stat.change ? 'ml-1' : ''}`}>
                  {stat.changeLabel}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
