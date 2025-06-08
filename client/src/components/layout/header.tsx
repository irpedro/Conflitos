import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activeSection: string;
}

const sectionTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Visão geral dos dados de conflitos armados"
  },
  database: {
    title: "Esquema do Banco",
    subtitle: "Estrutura completa das tabelas e relacionamentos"
  },
  queries: {
    title: "Consultas SQL",
    subtitle: "Execute e gerencie consultas personalizadas"
  },
  reports: {
    title: "Relatórios",
    subtitle: "Análises e visualizações dos dados"
  },
  management: {
    title: "Gestão de Dados",
    subtitle: "Cadastro e gerenciamento de entidades"
  },
  triggers: {
    title: "Triggers & Restrições",
    subtitle: "Integridade e validações do banco de dados"
  }
};

export default function Header({ activeSection }: HeaderProps) {
  const { title, subtitle } = sectionTitles[activeSection] || sectionTitles.dashboard;

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar Dados
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova Consulta
          </Button>
        </div>
      </div>
    </header>
  );
}
