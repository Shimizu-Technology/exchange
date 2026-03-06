"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { CheckCircle, Clock, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";

export default function AdminReportsPage() {
  const reportsData = useQuery(api.admin.listReports);
  const reports = reportsData ?? [];
  const moderateReport = useMutation(api.admin.moderateReport);
  const [actionError, setActionError] = useState<string | null>(null);

  const pending = reports.filter((r: any) => r.status === "pending");
  const resolved = reports.filter((r: any) => r.status === "resolved");

  const handleModerate = async (
    reportId: Id<"reports">,
    action: "resolve" | "hide" | "remove",
  ) => {
    setActionError(null);
    try {
      await moderateReport({ reportId, action });
    } catch (err) {
      console.error("Moderation action failed", err);
      setActionError("Action failed. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ocean mb-6">Reports</h1>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-charcoal mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Pending ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((report) => (
              <div key={report._id} className="bg-white rounded-xl p-5 border border-charcoal/5 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-charcoal mb-1">{report.reason}</p>
                    {report.details && <p className="text-sm text-muted mb-2">{report.details}</p>}
                    <p className="text-xs text-muted">
                      {new Date(report.createdAt).toLocaleDateString()} · Reporter: {report.reporter?.name ?? "Unknown"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-charcoal/10 p-3 bg-cream/60">
                    <p className="text-sm font-medium text-charcoal">{report.listing?.title ?? "Listing unavailable"}</p>
                    {report.listing && (
                      <p className="text-xs text-muted mt-1">
                        Status: {report.listing.status} · Hidden: {report.listing.isHidden ? "yes" : "no"}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => void handleModerate(report._id, "resolve")}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg bg-sage/10 text-sage hover:bg-sage/20 transition-colors font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Resolve
                    </button>
                    <button
                      onClick={() => void handleModerate(report._id, "hide")}
                      disabled={!report.listing}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <EyeOff className="w-4 h-4" />
                      Hide listing
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Permanently remove this listing?")) {
                          void handleModerate(report._id, "remove");
                        }
                      }}
                      disabled={!report.listing}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg bg-coral/10 text-coral hover:bg-coral/20 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove listing
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {actionError && (
        <div className="mb-4 rounded-lg border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">
          {actionError}
        </div>
      )}

      {pending.length === 0 && (
        <div className="bg-white rounded-xl p-8 border border-charcoal/5 text-center mb-8">
          <CheckCircle className="w-12 h-12 text-sage mx-auto mb-3" />
          <p className="text-muted">No pending reports. All clear!</p>
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-charcoal mb-4">Resolved ({resolved.length})</h2>
          <div className="space-y-2">
            {resolved.map((report) => (
              <div key={report._id} className="bg-white/50 rounded-xl p-4 border border-charcoal/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">{report.reason}</p>
                    <p className="text-xs text-muted/60">{new Date(report.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs text-sage font-medium">Resolved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
