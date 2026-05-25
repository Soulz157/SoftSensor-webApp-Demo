"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Box,
  Search,
  Plus,
  Play,
  Pause,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  ServerCrash,
  Siren,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ModelStatus = "running" | "error" | "warning" | "alert" | "offline";

interface Model {
  id: string;
  name: string;
  workspace: string;
  workspaceId: string;
  status: ModelStatus;
  statusDetails?: string;
  accuracy: string;
  lastTrained: string;
  lastRun: string;
  type: string;
}

const allModels: Model[] = [
  {
    id: "1",
    name: "Temperature Predictor",
    workspace: "Acme Corporation",
    workspaceId: "1",
    status: "running",
    accuracy: "94.2%",
    lastTrained: "2 days ago",
    lastRun: "2 min ago",
    type: "Regression",
  },
  {
    id: "2",
    name: "Demand Forecaster",
    workspace: "Acme Corporation",
    workspaceId: "1",
    status: "running",
    accuracy: "91.8%",
    lastTrained: "1 week ago",
    lastRun: "5 min ago",
    type: "Time Series",
  },
  {
    id: "3",
    name: "Anomaly Detector",
    workspace: "TechFlow Inc",
    workspaceId: "2",
    status: "error",
    statusDetails: "Deployment Failure: Missing input assets",
    accuracy: "87.5%",
    lastTrained: "3 days ago",
    lastRun: "12 min ago",
    type: "Classification",
  },
  {
    id: "4",
    name: "Quality Classifier",
    workspace: "TechFlow Inc",
    workspaceId: "2",
    status: "running",
    accuracy: "96.1%",
    lastTrained: "5 days ago",
    lastRun: "Just now",
    type: "Classification",
  },
  {
    id: "5",
    name: "Latency Monitor",
    workspace: "Acme Corporation",
    workspaceId: "1",
    status: "warning",
    statusDetails: "Usage Warning: Latency exceeding normal threshold",
    accuracy: "89.3%",
    lastTrained: "2 weeks ago",
    lastRun: "1 hour ago",
    type: "Time Series",
  },
  {
    id: "6",
    name: "Vibration Analyzer",
    workspace: "Acme Corporation",
    workspaceId: "1",
    status: "running",
    accuracy: "91.5%",
    lastTrained: "4 days ago",
    lastRun: "3 min ago",
    type: "Signal Processing",
  },
  {
    id: "7",
    name: "Load Balancer AI",
    workspace: "TechFlow Inc",
    workspaceId: "2",
    status: "running",
    accuracy: "97.2%",
    lastTrained: "1 day ago",
    lastRun: "1 min ago",
    type: "Optimization",
  },
  {
    id: "8",
    name: "Cooling Optimizer",
    workspace: "TechFlow Inc",
    workspaceId: "2",
    status: "running",
    accuracy: "88.5%",
    lastTrained: "6 days ago",
    lastRun: "8 min ago",
    type: "Control",
  },
  {
    id: "9",
    name: "Traffic Analyzer",
    workspace: "TechFlow Inc",
    workspaceId: "2",
    status: "running",
    accuracy: "95.1%",
    lastTrained: "3 days ago",
    lastRun: "4 min ago",
    type: "Classification",
  },
  {
    id: "10",
    name: "Data Drifter",
    workspace: "Globex",
    workspaceId: "4",
    status: "alert",
    statusDetails: "Usage Alert: Critical data drift detected",
    accuracy: "92.4%",
    lastTrained: "1 month ago",
    lastRun: "2 days ago",
    type: "Regression",
  },
  {
    id: "11",
    name: "Energy Optimizer",
    workspace: "DataSense Ltd",
    workspaceId: "3",
    status: "warning",
    statusDetails: "Usage Warning: Prediction accuracy degraded",
    accuracy: "89.7%",
    lastTrained: "2 weeks ago",
    lastRun: "30 min ago",
    type: "Optimization",
  },
  {
    id: "12",
    name: "Maintenance Predictor",
    workspace: "Acme Corporation",
    workspaceId: "1",
    status: "offline",
    accuracy: "90.2%",
    lastTrained: "2 weeks ago",
    lastRun: "3 hours ago",
    type: "Prediction",
  },
  {
    id: "13",
    name: "Compression AI",
    workspace: "DataSense Ltd",
    workspaceId: "3",
    status: "running",
    accuracy: "94.8%",
    lastTrained: "1 week ago",
    lastRun: "15 min ago",
    type: "Compression",
  },
];

type StatusFilter = "all" | ModelStatus;

export default function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("error");
  const [workspaceFilter, setWorkspaceFilter] = useState<string>("all");

  const filteredModels = allModels.filter((model) => {
    const matchesSearch = model.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || model.status === statusFilter;
    const matchesWorkspace =
      workspaceFilter === "all" || model.workspaceId === workspaceFilter;
    return matchesSearch && matchesStatus && matchesWorkspace;
  });

  const getStatusIcon = (status: ModelStatus) => {
    switch (status) {
      case "running":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "error":
        return <ServerCrash className="h-4 w-4 text-orange-500" />;
      case "warning":
        return <Siren className="h-4 w-4 text-yellow-400" />;
      case "alert":
        return <Siren className="h-4 w-4 text-red-500" />;
      case "offline":
        return <XCircle className="h-4 w-4 text-zinc-500" />;
    }
  };

  const getStatusBadge = (status: ModelStatus) => {
    switch (status) {
      case "running":
        return "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20";
      case "error":
        return "bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20";
      case "warning":
        return "bg-yellow-400/10 text-yellow-400 ring-1 ring-yellow-400/20";
      case "alert":
        return "bg-red-500/10 text-red-500 ring-1 ring-red-500/20";
      case "offline":
        return "bg-zinc-500/10 text-zinc-500 ring-1 ring-zinc-500/20";
    }
  };

  const getStatusLabel = (status: ModelStatus) => {
    switch (status) {
      case "running":
        return "Running";
      case "error":
        return "Error";
      case "warning":
        return "Warning";
      case "alert":
        return "Alert";
      case "offline":
        return "Offline";
    }
  };

  const getStatusDetailColor = (status: ModelStatus) => {
    switch (status) {
      case "error":
        return "text-orange-500";
      case "warning":
        return "text-yellow-400";
      case "alert":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const stats = {
    total: allModels.length,
    running: allModels.filter((m) => m.status === "running").length,
    error: allModels.filter((m) => m.status === "error").length,
    warning: allModels.filter((m) => m.status === "warning").length,
    alert: allModels.filter((m) => m.status === "alert").length,
    offline: allModels.filter((m) => m.status === "offline").length,
  };

  const kpis: {
    key: StatusFilter;
    label: string;
    value: number;
    color: string;
    bg: string;
    Icon: typeof CheckCircle2;
    sub?: string;
  }[] = [
    {
      key: "running",
      label: "Running",
      value: stats.running,
      color: "text-emerald-500",
      bg: "bg-emerald-500/5",
      Icon: CheckCircle2,
    },
    {
      key: "error",
      label: "Error (Deployment)",
      value: stats.error,
      color: "text-orange-500",
      bg: "bg-orange-500/5",
      Icon: ServerCrash,
      sub: "Deployment failures (e.g., config error, broken build)",
    },
    {
      key: "warning",
      label: "Alarm — Warning (Usage)",
      value: stats.warning,
      color: "text-yellow-400",
      bg: "bg-yellow-400/5",
      Icon: Siren,
      sub: "Usage warnings (e.g., high average latency)",
    },
    {
      key: "alert",
      label: "Alarm — Alert (Usage)",
      value: stats.alert,
      color: "text-red-500",
      bg: "bg-red-500/5",
      Icon: Siren,
      sub: "Usage alerts (e.g., critical data drift, prediction failure)",
    },
    {
      key: "offline",
      label: "Offline",
      value: stats.offline,
      color: "text-zinc-500",
      bg: "bg-zinc-500/5",
      Icon: XCircle,
    },
  ];

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Models</h1>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary ring-1 ring-primary/20">
              <Box className="h-3 w-3" />
              {stats.total} models
            </span>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and monitor your AI models
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Import Model
          </Button>
        </div>

        {/* KPI Panels */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
          {kpis.map(({ key, label, value, color, bg, Icon, sub }) => {
            const active = statusFilter === key;
            return (
              <Card
                key={key}
                onClick={() => setStatusFilter(active ? "all" : key)}
                className={`relative overflow-hidden bg-card border-border cursor-pointer transition-all hover:border-foreground/20 ${
                  active ? "ring-2 ring-offset-2 ring-offset-background" : ""
                }`}
                style={
                  active
                    ? {
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.04)",
                      }
                    : undefined
                }
              >
                <div
                  className={`absolute inset-0 ${bg} pointer-events-none`}
                  aria-hidden
                />
                <CardContent className="pt-6 relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground truncate">
                        {label}
                      </p>
                      <p className={`mt-1 text-3xl font-bold ${color}`}>
                        {value}
                      </p>
                    </div>
                    <Icon
                      className={`h-8 w-8 shrink-0 ${color} drop-shadow-[0_0_10px_currentColor]`}
                    />
                  </div>
                  {sub && (
                    <p className="mt-3 text-xs leading-snug text-muted-foreground">
                      {sub}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Status</option>
                <option value="error">Error</option>
                <option value="warning">Alarm — Warning</option>
                <option value="alert">Alarm — Alert</option>
                <option value="running">Running</option>
                <option value="offline">Offline</option>
              </select>

              {/* Workspace Filter */}
              <select
                value={workspaceFilter}
                onChange={(e) => setWorkspaceFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Workspaces</option>
                <option value="1">Acme Corporation</option>
                <option value="2">TechFlow Inc</option>
                <option value="3">DataSense Ltd</option>
                <option value="4">Globex</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Models Table */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <button className="flex items-center gap-1 hover:text-foreground">
                        Model <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Workspace
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Last Trained
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Last Run
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredModels.map((model) => (
                    <tr
                      key={model.id}
                      className="hover:bg-accent/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/models/${model.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                            <Box className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium text-foreground hover:text-primary">
                            {model.name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {model.workspace}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {model.type}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(model.status)}`}
                        >
                          {getStatusIcon(model.status)}
                          <span>{getStatusLabel(model.status)}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {model.statusDetails ? (
                          <span className={getStatusDetailColor(model.status)}>
                            {model.statusDetails}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        {model.accuracy}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {model.lastTrained}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {model.lastRun}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {model.status === "running" ? (
                            <Button variant="ghost" size="icon" title="Stop">
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon" title="Start">
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" title="Retrain">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredModels.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <Box className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium text-foreground">
                  No models found
                </p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
