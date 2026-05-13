"use client";

import { useState, use } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Box, 
  X, 
  Cpu, 
  Activity, 
  Thermometer, 
  Gauge, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from "lucide-react";

interface Node {
  id: string;
  name: string;
  type: "machine" | "sensor" | "controller";
  x: number;
  y: number;
  status: "online" | "warning" | "offline";
  models: {
    id: string;
    name: string;
    status: "running" | "stopped" | "error";
    accuracy?: string;
  }[];
}

const workspaceData: Record<string, { name: string; nodes: Node[] }> = {
  "1": {
    name: "Acme Corporation",
    nodes: [
      {
        id: "n1",
        name: "CNC Machine A1",
        type: "machine",
        x: 15,
        y: 20,
        status: "online",
        models: [
          { id: "m1", name: "Temperature Predictor", status: "running", accuracy: "94.2%" },
          { id: "m2", name: "Vibration Analyzer", status: "running", accuracy: "91.5%" },
        ],
      },
      {
        id: "n2",
        name: "Assembly Robot B2",
        type: "machine",
        x: 45,
        y: 25,
        status: "online",
        models: [
          { id: "m3", name: "Quality Classifier", status: "running", accuracy: "96.1%" },
        ],
      },
      {
        id: "n3",
        name: "Conveyor System C1",
        type: "machine",
        x: 75,
        y: 20,
        status: "warning",
        models: [
          { id: "m4", name: "Speed Optimizer", status: "error", accuracy: "87.3%" },
          { id: "m5", name: "Load Predictor", status: "running", accuracy: "89.8%" },
        ],
      },
      {
        id: "n4",
        name: "Temperature Sensor T1",
        type: "sensor",
        x: 25,
        y: 55,
        status: "online",
        models: [
          { id: "m6", name: "Anomaly Detector", status: "running", accuracy: "92.4%" },
        ],
      },
      {
        id: "n5",
        name: "Pressure Sensor P1",
        type: "sensor",
        x: 55,
        y: 60,
        status: "online",
        models: [],
      },
      {
        id: "n6",
        name: "Main Controller",
        type: "controller",
        x: 45,
        y: 80,
        status: "online",
        models: [
          { id: "m7", name: "Energy Optimizer", status: "running", accuracy: "93.7%" },
          { id: "m8", name: "Demand Forecaster", status: "running", accuracy: "91.8%" },
          { id: "m9", name: "Maintenance Predictor", status: "stopped" },
        ],
      },
    ],
  },
  "2": {
    name: "TechFlow Inc",
    nodes: [
      {
        id: "n1",
        name: "Server Rack A",
        type: "machine",
        x: 20,
        y: 25,
        status: "online",
        models: [
          { id: "m1", name: "Load Balancer AI", status: "running", accuracy: "97.2%" },
        ],
      },
      {
        id: "n2",
        name: "Data Center B",
        type: "machine",
        x: 60,
        y: 30,
        status: "warning",
        models: [
          { id: "m2", name: "Cooling Optimizer", status: "running", accuracy: "88.5%" },
        ],
      },
      {
        id: "n3",
        name: "Network Hub",
        type: "controller",
        x: 40,
        y: 70,
        status: "online",
        models: [
          { id: "m3", name: "Traffic Analyzer", status: "running", accuracy: "95.1%" },
        ],
      },
    ],
  },
  "3": {
    name: "DataSense Ltd",
    nodes: [
      {
        id: "n1",
        name: "Processing Unit 1",
        type: "machine",
        x: 30,
        y: 35,
        status: "offline",
        models: [
          { id: "m1", name: "Data Classifier", status: "stopped" },
        ],
      },
      {
        id: "n2",
        name: "Storage Array",
        type: "machine",
        x: 70,
        y: 40,
        status: "online",
        models: [
          { id: "m2", name: "Compression AI", status: "running", accuracy: "94.8%" },
        ],
      },
    ],
  },
};

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [zoom, setZoom] = useState(1);

  const workspace = workspaceData[id] || workspaceData["1"];

  const getNodeIcon = (type: Node["type"]) => {
    switch (type) {
      case "machine":
        return <Cpu className="h-5 w-5" />;
      case "sensor":
        return <Thermometer className="h-5 w-5" />;
      case "controller":
        return <Gauge className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: Node["status"]) => {
    switch (status) {
      case "online":
        return "bg-emerald-500";
      case "warning":
        return "bg-amber-500";
      case "offline":
        return "bg-red-500";
    }
  };

  const getModelStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
      case "stopped":
        return <XCircle className="h-3.5 w-3.5 text-muted-foreground" />;
      case "error":
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />;
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-1 overflow-hidden">
        {/* 3D Visualization Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
            <div>
              <h1 className="text-lg font-semibold text-foreground">{workspace.name}</h1>
              <p className="text-xs text-muted-foreground">
                {workspace.nodes.length} nodes - Click on a node to view details
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(1)}
                title="Reset View"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Fullscreen">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Visualization Canvas */}
          <div className="flex-1 relative overflow-hidden bg-muted/30">
            {/* Grid Background */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                `,
                backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
              }}
            />

            {/* Floor Plan / Factory Layout Representation */}
            <div 
              className="absolute inset-4 border-2 border-dashed border-border/50 rounded-lg"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
            >
              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      className="fill-primary/30"
                    />
                  </marker>
                </defs>
                {/* Draw connections between nodes */}
                {workspace.nodes.map((node, i) => {
                  if (i === workspace.nodes.length - 1) return null;
                  const nextNode = workspace.nodes[i + 1];
                  return (
                    <line
                      key={`line-${node.id}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${nextNode.x}%`}
                      y2={`${nextNode.y}%`}
                      className="stroke-primary/20"
                      strokeWidth="2"
                      strokeDasharray="8 4"
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              {workspace.nodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`absolute flex flex-col items-center gap-1 p-2 rounded-lg transition-all hover:scale-110 ${
                    selectedNode?.id === node.id
                      ? "bg-primary/20 ring-2 ring-primary"
                      : "bg-card hover:bg-accent"
                  } border border-border shadow-lg`}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="relative">
                    <div className={`p-2 rounded-md ${
                      node.status === "online" ? "bg-primary/10 text-primary" :
                      node.status === "warning" ? "bg-amber-500/10 text-amber-500" :
                      "bg-red-500/10 text-red-500"
                    }`}>
                      {getNodeIcon(node.type)}
                    </div>
                    <span className={`absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full ${getStatusColor(node.status)} ring-2 ring-card`} />
                  </div>
                  <span className="text-[10px] font-medium text-foreground whitespace-nowrap max-w-20 truncate">
                    {node.name}
                  </span>
                  {node.models.length > 0 && (
                    <span className="text-[9px] text-muted-foreground">
                      {node.models.length} model{node.models.length > 1 ? "s" : ""}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg border border-border p-3 shadow-lg">
              <p className="text-xs font-medium text-foreground mb-2">Legend</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Online
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Warning
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Offline
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Node Details Panel */}
        {selectedNode && (
          <div className="w-80 border-l border-border bg-card flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${
                  selectedNode.status === "online" ? "bg-primary/10 text-primary" :
                  selectedNode.status === "warning" ? "bg-amber-500/10 text-amber-500" :
                  "bg-red-500/10 text-red-500"
                }`}>
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">{selectedNode.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{selectedNode.type}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* Status Card */}
              <Card className="border-border">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${getStatusColor(selectedNode.status)}`} />
                    <span className="text-sm font-medium text-foreground capitalize">
                      {selectedNode.status}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Models Running */}
              <Card className="border-border">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    AI Models ({selectedNode.models.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  {selectedNode.models.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">No models assigned</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedNode.models.map((model) => (
                        <div
                          key={model.id}
                          className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Box className="h-3.5 w-3.5 text-muted-foreground" />
                            <div>
                              <p className="text-xs font-medium text-foreground">{model.name}</p>
                              {model.accuracy && (
                                <p className="text-[10px] text-muted-foreground">{model.accuracy} accuracy</p>
                              )}
                            </div>
                          </div>
                          {getModelStatusIcon(model.status)}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-border">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-3 px-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Uptime</span>
                    <span className="text-xs font-medium text-foreground">99.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Last Update</span>
                    <span className="text-xs font-medium text-foreground">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Data Points</span>
                    <span className="text-xs font-medium text-foreground">1.2M</span>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Chart Placeholder */}
              <Card className="border-border">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-3 px-4">
                  <div className="flex items-end gap-1 h-16">
                    {[40, 65, 45, 80, 55, 70, 85, 60, 75, 50, 90, 65].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary/20 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">Last 12 hours</p>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-border">
              <Button className="w-full" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                View Full Details
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
