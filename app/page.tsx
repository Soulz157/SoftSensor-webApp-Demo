"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { DashboardContent } from "@/components/dashboard-content";
import { CreateWorkspaceDialog } from "@/components/create-project-dialog";

export default function Home() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header onCreateWorkspace={() => setCreateDialogOpen(true)} />

        {/* Dashboard Content */}
        <DashboardContent />
      </div>

      {/* Create Workspace Dialog */}
      <CreateWorkspaceDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </div>
  );
}
