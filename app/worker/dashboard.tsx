"use client";

/**
 * Worker Dashboard
 * Issue assignment, progress tracking, and resolution workflow
 */

import React, { useState } from "react";
import type { Issue } from "@/lib/types";
import { demoWorkflowService } from "@/lib/services";

interface WorkerDashboardProps {
  workerId?: string;
  onUpdateStatus?: (issueId: string, status: string) => void;
}

export function WorkerDashboard({ 
  workerId = "WRK-201", 
  onUpdateStatus 
}: WorkerDashboardProps) {
  const [issues, setIssues] = useState<Issue[]>(() => demoWorkflowService.getAssignedIssues(workerId));
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("Assigned");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const loading = false;

  const filteredIssues = issues.filter((issue) => {
    if (filterStatus === "all") return true;
    return issue.status === filterStatus;
  });

  const handleStatusUpdate = (issueId: string, newStatus: string) => {
    onUpdateStatus?.(issueId, newStatus);
    const updatedIssue = demoWorkflowService.updateIssueStatus(issueId, newStatus as Issue["status"]);
    if (updatedIssue) {
      setIssues(demoWorkflowService.getAssignedIssues(workerId));
      setSelectedIssue(updatedIssue);
    }
  };

  const handleAddNote = (issueId: string, note: string) => {
    setNotes({ ...notes, [issueId]: note });
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Assigned":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200";
      case "In Progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200";
      case "Resolved":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading worker dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Worker Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track assigned issues and update resolution progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Assigned</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {issues.filter((i) => i.status === "Assigned").length}
            </div>
          </div>
          <div className="rounded-lg bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">In Progress</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {issues.filter((i) => i.status === "In Progress").length}
            </div>
          </div>
          <div className="rounded-lg bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Resolved</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {issues.filter((i) => i.status === "Resolved").length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Issue List */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">My Issues</h2>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue) => (
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
                            {issue.location.address}
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

          {/* Issue Details & Actions */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-6">
              {selectedIssue ? (
                <div>
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                      {selectedIssue.id}
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Description
                      </p>
                      <p className="text-sm text-slate-900 dark:text-white mt-2">
                        {selectedIssue.title}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Category
                      </p>
                      <p className="text-sm text-slate-900 dark:text-white mt-2">
                        {selectedIssue.category}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                        Update Status
                      </p>
                      <div className="space-y-2">
                        {["Assigned", "In Progress", "Resolved"].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(selectedIssue.id, status)}
                            className={`w-full px-3 py-2 rounded text-sm font-medium transition ${
                              selectedIssue.status === status
                                ? "bg-sky-600 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                        Work Notes
                      </p>
                      <textarea
                        value={notes[selectedIssue.id] || ""}
                        onChange={(e) => handleAddNote(selectedIssue.id, e.target.value)}
                        placeholder="Add notes about your work..."
                        className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-sky-600"
                      />
                    </div>

                    {selectedIssue.status === "Resolved" && (
                      <div className="p-3 rounded bg-emerald-50 dark:bg-emerald-900/20 text-sm text-emerald-800 dark:text-emerald-200">
                        ✓ Issue resolved and ready for citizen verification
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                  <p>Select an issue to view details and update status</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerDashboard;
