"use client";

import { useState } from "react";
import { X, Box, Upload, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImportModelDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ImportModelDialog({ open, onClose }: ImportModelDialogProps) {
  const [importType, setImportType] = useState<"file" | "api">("file");
  const [name, setName] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    setName("");
    setApiUrl("");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <Card className="relative z-10 w-full max-w-lg border-border bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Box className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Import Model</h2>
              <p className="text-xs text-muted-foreground">Add a new AI model to your workspace</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Import Type Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setImportType("file")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
              importType === "file"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Upload className="h-4 w-4" />
            Upload File
          </button>
          <button
            onClick={() => setImportType("api")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
              importType === "api"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            Connect API
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Model Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter model name"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {importType === "file" ? (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Model File
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Drag and drop your model file
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Supports .pkl, .h5, .onnx, .pt files
                </p>
                <Button type="button" variant="outline" size="sm">
                  Browse Files
                </Button>
                <input
                  type="file"
                  accept=".pkl,.h5,.onnx,.pt,.pth"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                API Endpoint
              </label>
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.example.com/model"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required={importType === "api"}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Enter the URL of your model API endpoint
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Assign to Workspace
            </label>
            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="1">Acme Corporation</option>
              <option value="2">TechFlow Inc</option>
              <option value="3">DataSense Ltd</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Import Model</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
