import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatsCards from "@/components/dashboard/stats-cards";
import Charts from "@/components/dashboard/charts";
import SchemaViewer from "@/components/database/schema-viewer";
import SqlEditor from "@/components/queries/sql-editor";
import ReportCards from "@/components/reports/report-cards";
import EntityForms from "@/components/management/entity-forms";
import TriggerViewer from "@/components/triggers/trigger-viewer";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="p-6 space-y-8">
            <StatsCards />
            <Charts />
          </div>
        );
      case "database":
        return <SchemaViewer />;
      case "reports":
        return <ReportCards />;
      case "management":
        return <EntityForms />;
      case "triggers":
        return <TriggerViewer />;
      default:
        return (
          <div className="p-6 space-y-8">
            <StatsCards />
            <Charts />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeSection={activeSection} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
