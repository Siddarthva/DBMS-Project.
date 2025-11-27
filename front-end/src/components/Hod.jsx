// src/components/Hod.jsx
import React, { useState } from "react";
import { INITIAL_CERTIFICATES, USERS } from "./mockData"; // Fixed import path
import { GlassCard, Button, Badge, PDFPreviewModal } from "./ui"; // Fixed import path
import { CheckCircle, XCircle, Trophy, Eye, Medal, Shield } from "lucide-react";

export default function Hod({ user, view }) {
  const [certs, setCerts] = useState(INITIAL_CERTIFICATES);
  const [preview, setPreview] = useState(null);

  const pending = certs.filter((c) => c.status === "pending_hod");

  const finalize = (id, approve = true) =>
    setCerts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: approve ? "approved" : "rejected" } : c
      )
    );

  if (view === "dashboard" || view === "approvals") {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-end border-b border-white/5 pb-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Final Approvals</h2>
                <p className="text-slate-400 text-sm mt-1">Review and grant final certification</p>
            </div>
            {pending.length > 0 && (
                <div className="text-right">
                    <span className="text-3xl font-bold text-blue-400">{pending.length}</span>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Pending</p>
                </div>
            )}
        </div>

        {pending.length === 0 && (
             <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-white/10">
                <Shield size={48} className="mx-auto text-emerald-500/50 mb-4" />
                <p className="text-slate-400 font-medium">All clear! No approvals required.</p>
            </div>
        )}

        <div className="grid gap-4">
            {pending.map((c) => (
            <GlassCard key={c.id} className="relative overflow-hidden group hover:border-blue-500/30 transition-all">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pl-4">
                    <div>
                        <h3 className="font-bold text-lg text-white">{c.studentName}</h3>
                        <p className="text-sm text-slate-400">{c.eventName}</p>
                        <div className="mt-2 flex gap-2">
                            <Badge status="pending_hod" />
                            <span className="text-xs text-slate-500 py-1 px-2 bg-slate-800 rounded">Forwarded by Mentor</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" icon={Eye} onClick={() => setPreview(c)}>Details</Button>
                        <Button variant="success" icon={CheckCircle} onClick={() => finalize(c.id, true)}>Approve</Button>
                        <Button variant="danger" icon={XCircle} onClick={() => finalize(c.id, false)}>Reject</Button>
                    </div>
                </div>
            </GlassCard>
            ))}
        </div>

        <PDFPreviewModal open={!!preview} cert={preview} onClose={() => setPreview(null)} />
      </div>
    );
  }

  if (view === "leaderboard") {
    const leaderboard = USERS.filter(u => u.role === "student").sort((a, b) => b.points - a.points);

    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center mb-8">
             <div className="inline-block p-4 rounded-full bg-yellow-500/10 mb-4 ring-1 ring-yellow-500/20">
                <Trophy className="text-yellow-500 drop-shadow-md" size={40} />
             </div>
             <h2 className="text-3xl font-bold text-white">Student Leaderboard</h2>
             <p className="text-slate-400">Top performers based on certified events</p>
        </div>

        <div className="space-y-3">
            {leaderboard.map((s, i) => {
                let rankColor = "bg-slate-900/40 border-white/5 hover:bg-slate-800/50";
                let rankIcon = <span className="text-slate-500 font-mono">#{i + 1}</span>;
                
                if(i === 0) { 
                    rankColor = "bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/30 shadow-lg shadow-yellow-900/10"; 
                    rankIcon = <Medal className="text-yellow-500" />; 
                }
                if(i === 1) { 
                    rankColor = "bg-gradient-to-r from-slate-400/10 to-transparent border-slate-400/30"; 
                    rankIcon = <Medal className="text-slate-400" />; 
                }
                if(i === 2) { 
                    rankColor = "bg-gradient-to-r from-orange-700/10 to-transparent border-orange-700/30"; 
                    rankIcon = <Medal className="text-orange-700" />; 
                }

                return (
                    <div key={s.id} className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 hover:scale-[1.01] ${rankColor}`}>
                        <div className="flex items-center gap-5">
                            <div className="w-8 text-center font-bold text-xl">{rankIcon}</div>
                            <div>
                                <p className={`font-bold text-lg ${i < 3 ? 'text-white' : 'text-slate-300'}`}>{s.name}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">{s.dept}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-2xl text-blue-400 font-mono">{s.points}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Points</p>
                        </div>
                    </div>
                )
            })}
        </div>
      </div>
    );
  }

  return null;
}