"use client";

import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  ChevronDown,
  Building2,
  Box,
  BarChart3,
  ChevronRight,
  X,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Workspace {
  id: string;
  name: string;
  modelsCount: number;
}

interface NavItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  badge?: number;
}

const workspaces: Workspace[] = [
  { id: "1", name: "Acme Corporation", modelsCount: 24 },
  { id: "2", name: "TechFlow Inc", modelsCount: 56 },
  { id: "3", name: "DataSense Ltd", modelsCount: 12 },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeNav: string;
  onNavChange: (nav: string) => void;
  activeWorkspace: string;
  onWorkspaceChange: (id: string) => void;
  workspaceOpen: boolean;
  onWorkspaceToggle: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  activeNav,
  onNavChange,
  activeWorkspace,
  onWorkspaceChange,
  workspaceOpen,
  onWorkspaceToggle,
}: SidebarProps) {
  const currentWorkspace = workspaces.find((w) => w.id === activeWorkspace);

  const navItems: NavItem[] = [
    { id: "dashboard", name: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "models", name: "Models", icon: <Box className="h-4 w-4" />, badge: currentWorkspace?.modelsCount },
    { id: "analytics", name: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "settings", name: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out lg:static",
          // Mobile: slide in/out
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: always visible, toggle width
          "lg:translate-x-0",
          isCollapsed ? "lg:w-16" : "lg:w-64",
          // Mobile always full width when open
          "w-64"
        )}
      >
        {/* Logo & Collapse Toggle */}
        <div className={cn(
          "flex items-center border-b border-sidebar-border transition-all",
          isCollapsed ? "justify-center px-2 py-4" : "justify-between px-4 py-4"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed && "lg:justify-center"
          )}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shrink-0">
              <Box className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className={cn(
              "text-lg font-semibold tracking-tight transition-opacity",
              isCollapsed ? "lg:hidden" : "lg:block"
            )}>
              SoftSensor
            </span>
          </div>
          
          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              "hidden lg:flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
              isCollapsed && "lg:hidden"
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
          
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Collapsed state: expand button at top */}
        {isCollapsed && (
          <div className="hidden lg:flex justify-center py-3">
            <button
              onClick={onToggleCollapse}
              className="flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              title="Expand sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Workspace Section */}
        <div className={cn("py-2", isCollapsed ? "px-2" : "px-3")}>
          {!isCollapsed && (
            <button
              onClick={onWorkspaceToggle}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
            >
              Workspaces
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  workspaceOpen && "rotate-180"
                )}
              />
            </button>
          )}

          {(workspaceOpen || isCollapsed) && (
            <div className={cn("space-y-1", !isCollapsed && "mt-2")}>
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => onWorkspaceChange(workspace.id)}
                  title={isCollapsed ? workspace.name : undefined}
                  className={cn(
                    "group flex w-full items-center rounded-md text-sm transition-colors",
                    isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                    activeWorkspace === workspace.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Building2 className="h-4 w-4 shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 truncate text-left">{workspace.name}</span>
                      <span className="text-xs text-sidebar-foreground/50">
                        {workspace.modelsCount}
                      </span>
                      {activeWorkspace === workspace.id && (
                        <ChevronRight className="h-3 w-3 text-primary" />
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className={cn("border-t border-sidebar-border", isCollapsed ? "mx-2" : "mx-3")} />

        {/* Navigation */}
        <nav className={cn("flex-1 py-4", isCollapsed ? "px-2" : "px-3")}>
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavChange(item.id)}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  "flex w-full items-center rounded-md text-sm font-medium transition-colors",
                  isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                  activeNav === item.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                {item.icon}
                {!isCollapsed && (
                  <>
                    <span>{item.name}</span>
                    {item.badge !== undefined && (
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
                  </>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Current Workspace Info */}
        {currentWorkspace && !isCollapsed && (
          <div className="mx-3 mb-3 rounded-lg bg-sidebar-accent/50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-sidebar-foreground">
                {currentWorkspace.name}
              </span>
            </div>
            <div className="text-xs text-sidebar-foreground/60">
              {currentWorkspace.modelsCount} / 100 models
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-sidebar-border">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(currentWorkspace.modelsCount / 100) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Collapsed Workspace indicator */}
        {currentWorkspace && isCollapsed && (
          <div className="mx-2 mb-3 flex flex-col items-center">
            <div 
              className="h-1.5 w-8 rounded-full bg-sidebar-border overflow-hidden"
              title={`${currentWorkspace.modelsCount} / 100 models`}
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(currentWorkspace.modelsCount / 100) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={cn(
          "border-t border-sidebar-border py-4",
          isCollapsed ? "px-2" : "px-3"
        )}>
          <button 
            title={isCollapsed ? "Help & Support" : undefined}
            className={cn(
              "flex w-full items-center rounded-md text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
              isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
            )}
          >
            <HelpCircle className="h-4 w-4" />
            {!isCollapsed && <span>Help & Support</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
