"use client";

import { Activity, Radio, FolderKanban, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Active Sensors",
    value: "48",
    change: "+12%",
    trend: "up",
    icon: Radio,
  },
  {
    title: "Projects",
    value: "12",
    change: "+3",
    trend: "up",
    icon: FolderKanban,
  },
  {
    title: "Data Points",
    value: "2.4M",
    change: "+18%",
    trend: "up",
    icon: Activity,
  },
  {
    title: "Uptime",
    value: "99.9%",
    change: "0%",
    trend: "stable",
    icon: TrendingUp,
  },
];

const recentActivity = [
  {
    id: 1,
    sensor: "Temperature Sensor A1",
    status: "online",
    value: "24.5°C",
    time: "2 min ago",
  },
  {
    id: 2,
    sensor: "Humidity Sensor B2",
    status: "warning",
    value: "78%",
    time: "5 min ago",
  },
  {
    id: 3,
    sensor: "Pressure Sensor C3",
    status: "online",
    value: "1013 hPa",
    time: "8 min ago",
  },
  {
    id: 4,
    sensor: "Motion Sensor D4",
    status: "online",
    value: "Active",
    time: "12 min ago",
  },
  {
    id: 5,
    sensor: "Light Sensor E5",
    status: "offline",
    value: "—",
    time: "1 hour ago",
  },
];

const projects = [
  {
    id: 1,
    name: "Smart Office Monitoring",
    sensors: 12,
    status: "active",
    lastUpdate: "Just now",
  },
  {
    id: 2,
    name: "Warehouse Climate Control",
    sensors: 24,
    status: "active",
    lastUpdate: "5 min ago",
  },
  {
    id: 3,
    name: "Server Room Monitoring",
    sensors: 8,
    status: "warning",
    lastUpdate: "10 min ago",
  },
];

export function DashboardContent() {
  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your sensor network and projects
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="mt-1 text-xs text-primary">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Radio className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.sensor}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">{item.value}</span>
                    {item.status === "online" && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                    {item.status === "warning" && (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                    {item.status === "offline" && (
                      <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FolderKanban className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.sensors} sensors · {project.lastUpdate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.status === "active" && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                        Active
                      </span>
                    )}
                    {project.status === "warning" && (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500">
                        Warning
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
