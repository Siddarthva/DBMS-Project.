// src/components/Mentor.jsx
import React, { useState } from "react";
import { INITIAL_CERTIFICATES } from "../mockData";
import { GlassCard, Button, Badge, PDFPreviewModal } from "../ui";
import { CheckCircle, XCircle, Eye, Search } from "lucide-react";

export default function Mentor({ user, view }) {
  const [certs, setCerts] = useState(INITIAL_CERTIFICATES);
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState("");

  const deptCerts = certs.filter((c) => c.dept === user.dept);
  const pending = deptCerts.filter((c) => c.status === "pending_mentor");
  const history = deptCerts.filter((c) => c.status !== "pending_mentor");

  const approve = (id) =>
    setCerts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "pending_hod" } : c
      )
    );

  const reject = (id) =>
    setCerts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "rejected" } : c
      )
    );

  const display = (view === "pending" ? pending : history)
    .filter((c) =>
      c.studentName.toLowerCase().includes(search.toLowerCase())
    );

  if (view === "dashboard" || view === "pending") {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-bold">Pending Certificates</h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-2 text-gray-400" size={18} />
          <input
            className="bg-slate-900/40 pl-10 pr-4 py-2 w-full rounded-lg border border-white/10"
            placeholder="Search student"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {display.length === 0 && (
          <p className="text-gray-500">No pending certificates</p>
        )}

        {display.map((c) => (
          <GlassCard key={c.id} className="flex items-center justify-between">
            <div>
              <p className="font-bold">{c.studentName}</p>
              <p className="text-sm text-gray-400">{c.eventName}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" icon={Eye} onClick={() => setPreview(c)}>
                View
              </Button>
              <Button icon={CheckCircle} variant="success" onClick={() => approve(c.id)}>
                Forward
              </Button>
              <Button icon={XCircle} variant="danger" onClick={() => reject(c.id)}>
                Reject
              </Button>
            </div>
          </GlassCard>
        ))}

        <PDFPreviewModal open={!!preview} cert={preview} onClose={() => setPreview(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Processed Certificates</h2>
      {history.map((c) => (
        <GlassCard key={c.id} className="flex justify-between">
          <p>{c.studentName}</p>
          <Badge status={c.status} />
        </GlassCard>
      ))}
    </div>
  );
}
