"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Box,
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Model {
  id: string;
  name: string;
  workspace: string;
  workspaceId: string;
  status: "running" | "stopped" | "error";
  accuracy: string;
  lastTrained: string;
  lastRun: string;
  type: string;
}

const allModels: Model[] = [
  { id: "1", name: "Temperature Predictor", workspace: "Acme Corporation", workspaceId: "1", status: "running", accuracy: "94.2%", lastTrained: "2 days ago", lastRun: "2 min ago", type: "Regression" },
  { id: "2", name: "Demand Forecaster", workspace: "Acme Corporation", workspaceId: "1", status: "running", accuracy: "91.8%", lastTrained: "1 week ago", lastRun: "5 min ago", type: "Time Series" },
  { id: "3", name: "Anomaly Detector", workspace: "TechFlow Inc", workspaceId: "2", status: "error", accuracy: "87.5%", lastTrained: "3 days ago", lastRun: "12 min ago", type: "Classification" },
  { id: "4", name: "Quality Classifier", workspace: "TechFlow Inc", workspaceId: "2", status: "running", accuracy: "96.1%", lastTrained: "5 days ago", lastRun: "Just now", type: "Classification" },
  { id: "5", name: "Energy Optimizer", workspace: "DataSense Ltd", workspaceId: "3", status: "stopped", accuracy: "89.3%", lastTrained: "2 weeks ago", lastRun: "1 hour ago", type: "Optimization" },
  { id: "6", name: "Vibration Analyzer", workspace: "Acme Corporation", workspaceId: "1", status: "running", accuracy: "91.5%", lastTrained: "4 days ago", lastRun: "3 min ago", type: "Signal Processing" },
  { id: "7", name: "Load Balancer AI", workspace: "TechFlow Inc", workspaceId: "2", status: "running", accuracy: "97.2%", lastTrained: "1 day ago", lastRun: "1 min ago", type: "Optimization" },
  { id: "8", name: "Cooling Optimizer", workspace: "TechFlow Inc", workspaceId: "2", status: "running", accuracy: "88.5%", lastTrained: "6 days ago", lastRun: "8 min ago", type: "Control" },
  { id: "9", name: "Traffic Analyzer", workspace: "TechFlow Inc", workspaceId: "2", status: "running", accuracy: "95.1%", lastTrained: "3 days ago", lastRun: "4 min ago", type: "Classification" },
  { id: "10", name: "Data Classifier", workspace: "DataSense Ltd", workspaceId: "3", status: "stopped", accuracy: "92.4%", lastTrained: "1 month ago", lastRun: "2 days ago", type: "Classification" },
  { id: "11", name: "Compression AI", workspace: "DataSense Ltd", workspaceId: "3", status: "running", accuracy: "94.8%", lastTrained: "1 week ago", lastRun: "15 min ago", type: "Compression" },
  { id: "12", name: "Maintenance Predictor", workspace: "Acme Corporation", workspaceId: "1", status: "stopped", accuracy: "90.2%", lastTrained: "2 weeks ago", lastRun: "3 hours ago", type: "Prediction" },
];

export default function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "running" | "stopped" | "error">("all");
  const [workspaceFilter, setWorkspaceFilter] = useState<string>("all");

  const filteredModels = allModels.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || model.status === statusFilter;
    const matchesWorkspace = workspaceFilter === "all" || model.workspaceId === workspaceFilter;
    return matchesSearch && matchesStatus && matchesWorkspace;
  });

  const getStatusIcon = (status: Model["status"]) => {
    switch (status) {
      case "running":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "stopped":
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: Model["status"]) => {
    switch (status) {
      case "running":
        return "bg-emerald-500/10 text-emerald-500";
      case "stopped":
        return "bg-muted text-muted-foreground";
      case "error":
        return "bg-amber-500/10 text-amber-500";
    }
  };

  const stats = {
    total: allModels.length,
    running: allModels.filter((m) => m.status === "running").length,
    stopped: allModels.filter((m) => m.status === "stopped").length,
    error: allModels.filter((m) => m.status === "error").length,
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Models</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and monitor your AI models
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Import Model
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Models</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <Box className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border cursor-pointer hover:bg-accent/30 transition-colors" onClick={() => setStatusFilter("running")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Running</p>
                  <p className="text-2xl font-bold text-emerald-500">{stats.running}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border cursor-pointer hover:bg-accent/30 transition-colors" onClick={() => setStatusFilter("stopped")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stopped</p>
                  <p className="text-2xl font-bold text-muted-foreground">{stats.stopped}</p>
                </div>
                <XCircle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border cursor-pointer hover:bg-accent/30 transition-colors" onClick={() => setStatusFilter("error")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Errors</p>
                  <p className="text-2xl font-bold text-amber-500">{stats.error}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
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
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Status</option>
                <option value="running">Running</option>
                <option value="stopped">Stopped</option>
                <option value="error">Error</option>
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
                    <tr key={model.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/models/${model.id}`} className="flex items-center gap-3">
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
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(model.status)}`}>
                          {getStatusIcon(model.status)}
                          <span className="capitalize">{model.status}</span>
                        </span>
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
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
                <p className="text-sm font-medium text-foreground">No models found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
