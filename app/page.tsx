"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { DashboardContent } from "@/components/dashboard-content";
import { CreateWorkspaceDialog } from "@/components/create-project-dialog";
import { ImportModelDialog } from "@/components/import-model-dialog";

export default function Home() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sidebar state
  const [activeWorkspace, setActiveWorkspace] = useState("1");
  const [workspaceOpen, setWorkspaceOpen] = useState(true);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeWorkspace={activeWorkspace}
        onWorkspaceChange={setActiveWorkspace}
        workspaceOpen={workspaceOpen}
        onWorkspaceToggle={() => setWorkspaceOpen(!workspaceOpen)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onCreateWorkspace={() => setCreateDialogOpen(true)}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Dashboard Content */}
        <DashboardContent
          onCreateWorkspace={() => setCreateDialogOpen(true)}
          onImportModel={() => setImportDialogOpen(true)}
        />
      </div>

      {/* Create Workspace Dialog */}
      <CreateWorkspaceDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />

      {/* Import Model Dialog */}
      <ImportModelDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
      />
    </div>
  );
}
