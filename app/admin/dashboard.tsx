"use client";

/**
 * Admin Dashboard
 * Issue queue management, assignment, and status tracking
 */

import React, { useState } from "react";
import type { Issue, Worker } from "@/lib/types";
import { demoWorkflowService } from "@/lib/services";


interface AdminDashboardProps {
  onAssignIssue?: (issueId: string, workerId: string) => void;
}

export function AdminDashboard({ onAssignIssue }: AdminDashboardProps) {
  const [issues, setIssues] = useState<Issue[]>(() => demoWorkflowService.getIssues());
  const [workers, setWorkers] = useState<Worker[]>(() => demoWorkflowService.getWorkers());
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"severity" | "created" | "status">("severity");
  const loading = false;

  const filteredIssues = issues.filter((issue) => {
    if (filterStatus === "all") return true;
    return issue.status === filterStatus;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === "severity") {
      const severityOrder: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      const aSeverity = a.severity ?? "Low";
      const bSeverity = b.severity ?? "Low";
      return (severityOrder[aSeverity] ?? 4) - (severityOrder[bSeverity] ?? 4);
    }
    if (sortBy === "created") {
      return b.createdAt - a.createdAt;
    }
    return 0;
  });

  const handleAssign = (issueId: string, workerId: string) => {
    onAssignIssue?.(issueId, workerId);
    const updatedIssue = demoWorkflowService.assignIssue(issueId, workerId);
    if (updatedIssue) {
      setIssues(demoWorkflowService.getIssues());
      setSelectedIssue(updatedIssue);
      setWorkers(demoWorkflowService.getWorkers());
    }
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Reported":
        return "bg-blue-100 text-blue-800";
      case "Classified":
        return "bg-purple-100 text-purple-800";
      case "Assigned":
        return "bg-indigo-100 text-indigo-800";
      case "In Progress":
        return "bg-amber-100 text-amber-800";
      case "Resolved":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage issues, assign to workers, and track resolution progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Issues</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{issues.length}</div>
          </div>
          <div className="rounded-lg bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {issues.filter((i) => i.status === "Reported").length}
            </div>
          </div>
          <div className="rounded-lg bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Assigned</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {issues.filter((i) => i.status === "Assigned").length}
            </div>
          </div>
          <div className="rounded-lg bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Workers</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {workers.filter((w) => w.status === "available").length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Issue Queue */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Issue Queue</h2>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="Reported">Reported</option>
                      <option value="Classified">Classified</option>
                      <option value="Assigned">Assigned</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "severity" | "created" | "status")}
                      className="px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    >
                      <option value="severity">Severity</option>
                      <option value="created">Newest</option>
                      <option value="status">Status</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
                {sortedIssues.length > 0 ? (
                  sortedIssues.map((issue) => (
                    <div
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${
                        selectedIssue?.id === issue.id
                          ? "bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-600"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-mono text-slate-500 dark:text-slate-400">
                              {issue.id}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-medium ${severityColor(issue.severity || "Low")}`}>
                              {issue.severity || "Low"}
                            </span>
                          </div>
                          <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {issue.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {issue.category || "Unclassified"}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded font-medium whitespace-nowrap ${statusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No issues found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Issue Details Panel */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-6">
              {selectedIssue ? (
                <div>
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Issue Details</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        ID
                      </p>
                      <p className="text-sm font-mono text-slate-900 dark:text-white mt-1">
                        {selectedIssue.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Title
                      </p>
                      <p className="text-sm text-slate-900 dark:text-white mt-1">
                        {selectedIssue.title}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Classification
                      </p>
                      {selectedIssue.classification && (
                        <div className="mt-2 p-3 rounded bg-slate-50 dark:bg-slate-800 text-sm space-y-2">
                          <div>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {selectedIssue.classification.category}
                            </span>
                            <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                              ({Math.round(selectedIssue.classification.confidence * 100)}% confidence)
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {selectedIssue.classification.reason}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                        Assign to Worker
                      </p>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssign(selectedIssue.id, e.target.value);
                          }
                        }}
                        className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                      >
                        <option value="">Select a worker...</option>
                        {workers
                          .filter(
                            (w) =>
                              w.department ===
                              (selectedIssue.classification?.department || "Other")
                          )
                          .map((worker) => (
                            <option key={worker.id} value={worker.id}>
                              {worker.name} ({worker.status})
                            </option>
                          ))}
                      </select>
                    </div>

                    {selectedIssue.assignedTo && (
                      <div className="p-3 rounded bg-emerald-50 dark:bg-emerald-900/20 text-sm text-emerald-800 dark:text-emerald-200">
                        ✓ Assigned to{" "}
                        {workers.find((w) => w.id === selectedIssue.assignedTo)?.name ||
                          "Unknown"}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                  <p>Select an issue to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
