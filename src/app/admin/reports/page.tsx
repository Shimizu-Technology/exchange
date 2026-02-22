"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { CheckCircle, Clock } from "lucide-react";

export default function AdminReportsPage() {
  const reportsData = useQuery(api.admin.listReports);
  const reports: any[] = reportsData ?? [];
  const resolveReport = useMutation(api.admin.resolveReport);

  const pending = reports.filter((r: any) => r.status === "pending");
  const resolved = reports.filter((r: any) => r.status === "resolved");

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
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-charcoal mb-1">{report.reason}</p>
                    {report.details && (
                      <p className="text-sm text-muted mb-2">{report.details}</p>
                    )}
                    <p className="text-xs text-muted">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => resolveReport({ reportId: report._id })}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg bg-sage/10 text-sage hover:bg-sage/20 transition-colors font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
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
