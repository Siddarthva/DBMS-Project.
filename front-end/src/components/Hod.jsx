// src/components/Hod.jsx
import React, { useState } from "react";
import { INITIAL_CERTIFICATES, USERS } from "../mockData";
import { GlassCard, Button, Badge, PDFPreviewModal } from "../ui";
import { CheckCircle, XCircle, Trophy, Eye } from "lucide-react";

export default function Hod({ user, view }) {
  const [certs, setCerts] = useState(INITIAL_CERTIFICATES);
  const [preview, setPreview] = useState(null);

  const pending = certs.filter((c) => c.status === "pending_hod");
  const approved = certs.filter((c) => c.status === "approved");

  const finalize = (id, approve = true) =>
    setCerts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: approve ? "approved" : "rejected" } : c
      )
    );

  if (view === "dashboard" || view === "approvals") {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-bold">Final Approvals</h2>
        {pending.length === 0 && <p className="text-gray-400">Everything approved!</p>}
        {pending.map((c) => (
          <GlassCard key={c.id} className="flex justify-between items-center">
            <div>
              <p className="font-bold">{c.studentName}</p>
              <p className="text-sm text-gray-400">{c.eventName}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" icon={Eye} onClick={() => setPreview(c)}>
                View
              </Button>
              <Button variant="success" icon={CheckCircle} onClick={() => finalize(c.id, true)}>
                Approve
              </Button>
              <Button variant="danger" icon={XCircle} onClick={() => finalize(c.id, false)}>
                Reject
              </Button>
            </div>
          </GlassCard>
        ))}

        <PDFPreviewModal open={!!preview} cert={preview} onClose={() => setPreview(null)} />
      </div>
    );
  }

  if (view === "leaderboard") {
    const leaderboard = USERS.filter(u => u.role === "student")
      .sort((a, b) => b.points - a.points);

    return (
      <div className="space-y-4 animate-fade-in">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-500" /> Leaderboard
        </h2>

        {leaderboard.map((s, i) => (
          <GlassCard key={s.id} className="flex justify-between">
            <p>{i + 1}. {s.name} ({s.dept})</p>
            <p className="font-bold text-blue-300">{s.points} pts</p>
          </GlassCard>
        ))}
      </div>
    );
  }

  return null;
}
