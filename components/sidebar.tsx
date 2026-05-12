"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Activity,
  Settings,
  HelpCircle,
  ChevronDown,
  Plus,
  Layers,
  Radio,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkspaceItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface NavItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  badge?: number;
}

const workspaces: WorkspaceItem[] = [
  { id: "1", name: "Production", icon: <Radio className="h-4 w-4" />, active: true },
  { id: "2", name: "Development", icon: <Layers className="h-4 w-4" /> },
  { id: "3", name: "Staging", icon: <Activity className="h-4 w-4" /> },
];

const navItems: NavItem[] = [
  { id: "dashboard", name: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "projects", name: "Projects", icon: <FolderKanban className="h-4 w-4" />, badge: 12 },
  { id: "sensors", name: "Sensors", icon: <Radio className="h-4 w-4" />, badge: 48 },
  { id: "analytics", name: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "settings", name: "Settings", icon: <Settings className="h-4 w-4" /> },
];

export function Sidebar() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [workspaceOpen, setWorkspaceOpen] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState("1");

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Activity className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold tracking-tight">SoftSensor</span>
      </div>

      {/* Workspace Section */}
      <div className="px-3 py-4">
        <button
          onClick={() => setWorkspaceOpen(!workspaceOpen)}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
        >
          Workspace
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              workspaceOpen && "rotate-180"
            )}
          />
        </button>

        {workspaceOpen && (
          <div className="mt-2 space-y-1">
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => setActiveWorkspace(workspace.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  activeWorkspace === workspace.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                {workspace.icon}
                {workspace.name}
                {activeWorkspace === workspace.id && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
              <Plus className="h-4 w-4" />
              Add Workspace
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                activeNav === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              {item.icon}
              {item.name}
              {item.badge && (
                <span
                  className={cn(
                    "ml-auto rounded-full px-2 py-0.5 text-xs",
                    activeNav === item.id
                      ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground"
                      : "bg-sidebar-accent text-sidebar-foreground/60"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
          <HelpCircle className="h-4 w-4" />
          Help & Support
        </button>
      </div>
    </aside>
  );
}
