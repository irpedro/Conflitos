import { Database, BarChart3, Search, ServerCog, Code, ChartLine } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: ChartLine },
    { id: "database", label: "Esquema do Banco", icon: Database },
    { id: "reports", label: "Relatórios", icon: BarChart3 },
    { id: "management", label: "Gestão de Dados", icon: ServerCog },
    { id: "triggers", label: "Triggers & Restrições", icon: Code },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-slate-200 flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800 flex items-center">
          <Database className="w-6 h-6 text-blue-600 mr-2" />
          ConflictDB
        </h1>
        <p className="text-sm text-slate-500 mt-1">Sistema de Análise de Conflitos</p>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      <div className="px-4 py-4 border-t border-slate-200">
        <div className="flex items-center text-sm text-slate-500">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Banco: Online
        </div>
        <div className="text-xs text-slate-400 mt-1">
          ConflictDB v1.0 | PostgreSQL
        </div>
      </div>
    </div>
  );
}
