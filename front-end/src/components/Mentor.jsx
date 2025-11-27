// src/components/Mentor.jsx
import React, { useState } from "react";
import { INITIAL_CERTIFICATES } from "./mockData"; // Fixed import path
import { GlassCard, Button, Badge, PDFPreviewModal } from "./ui"; // Fixed import path
import { CheckCircle, XCircle, Eye, Search, Inbox, History } from "lucide-react";

export default function Mentor({ user, view }) {
  const [certs, setCerts] = useState(INITIAL_CERTIFICATES);
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState("");

  const deptCerts = certs.filter((c) => c.dept === user.dept);
  const pending = deptCerts.filter((c) => c.status === "pending_mentor");
  const history = deptCerts.filter((c) => c.status !== "pending_mentor");

  const approve = (id) =>
    setCerts((prev) => prev.map((c) => c.id === id ? { ...c, status: "pending_hod" } : c));

  const reject = (id) =>
    setCerts((prev) => prev.map((c) => c.id === id ? { ...c, status: "rejected" } : c));

  const display = (view === "pending" ? pending : history)
    .filter((c) => c.studentName.toLowerCase().includes(search.toLowerCase()));

  if (view === "dashboard" || view === "pending") {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Inbox className="text-blue-400" /> Pending Review
            </h2>
            <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input
                    className="bg-slate-900/50 border border-white/10 pl-10 pr-4 py-2 w-full rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    placeholder="Search student..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        {display.length === 0 && (
          <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl bg-slate-900/20">
              <p className="text-slate-500">No pending certificates found.</p>
          </div>
        )}

        <div className="grid gap-4">
            {display.map((c) => (
            <GlassCard key={c.id} className="group hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-lg text-blue-400 border border-white/5">
                            {c.studentName.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">{c.studentName}</p>
                            <p className="text-sm text-slate-400">{c.eventName}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" icon={Eye} onClick={() => setPreview(c)}>View</Button>
                        <Button icon={CheckCircle} variant="success" onClick={() => approve(c.id)}>Forward</Button>
                        <Button icon={XCircle} variant="danger" onClick={() => reject(c.id)}>Reject</Button>
                    </div>
                </div>
            </GlassCard>
            ))}
        </div>

        <PDFPreviewModal open={!!preview} cert={preview} onClose={() => setPreview(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <History className="text-violet-400" /> Processed History
      </h2>
      <div className="grid gap-3">
        {history.map((c) => (
            <div key={c.id} className="bg-slate-900/40 p-4 rounded-xl border border-white/5 flex justify-between items-center hover:bg-slate-800/50 transition">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400 border border-white/5">
                        {c.studentName.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-200">{c.studentName}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500 hidden sm:block">{c.eventName}</span>
                    <Badge status={c.status} />
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}