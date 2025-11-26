// src/components/Student.jsx
import React, { useState } from "react";
import { EVENTS, INITIAL_CERTIFICATES } from "../mockData";
import { GlassCard, Button, Badge, FileUploadModal } from "../ui";
import { Award, FileText, Trophy, Upload } from "lucide-react";

export default function Student({ user, view }) {
  const [certs, setCerts] = useState(INITIAL_CERTIFICATES);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  const myCerts = certs.filter((c) => c.studentId === user.id);

  const participate = (ev) => {
    setCerts([
      {
        id: Math.floor(Math.random() * 90000),
        eventId: ev.id,
        eventName: ev.title,
        studentId: user.id,
        studentName: user.name,
        dept: user.dept,
        status: "pending_upload",
      },
      ...certs,
    ]);
  };

  const uploadFile = (file) => {
    setCerts((prev) =>
      prev.map((c) =>
        c.id === selectedCert ? { ...c, status: "pending_mentor", file: file.name } : c
      )
    );
    setUploadOpen(false);
  };

  if (view === "dashboard") {
    return (
      <div className="space-y-6 animate-fade-in">
        
        {/* Profile */}
        <GlassCard className="flex items-center gap-4">
          <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold">
            {user.name[0]}
          </div>
          <div>
            <p className="text-xl font-bold">{user.name}</p>
            <p className="text-sm text-gray-400">{user.dept} | Sem {user.sem}</p>
          </div>
        </GlassCard>

        {/* Activity */}
        <GlassCard>
          <p className="font-bold mb-2">Recent Certificates</p>
          {myCerts.slice(0, 3).map((c) => (
            <div key={c.id} className="flex justify-between border-b border-white/10 py-2">
              <span>{c.eventName}</span>
              <Badge status={c.status} />
            </div>
          ))}
          {myCerts.length === 0 && <p className="text-gray-400">No activity</p>}
        </GlassCard>

      </div>
    );
  }

  if (view === "events") {
    return (
      <div className="grid md:grid-cols-2 gap-4 animate-fade">
        {EVENTS.map((ev) => (
          <GlassCard key={ev.id} className="flex flex-col gap-4">
            <p className="text-lg font-bold">{ev.title}</p>
            <p className="flex gap-2 text-blue-300"><Trophy /> {ev.points} pts</p>
            <Button
              onClick={() => participate(ev)}
              icon={Award}
              className="mt-auto"
            >
              Participate
            </Button>
          </GlassCard>
        ))}
      </div>
    );
  }

  if (view === "history") {
    return (
      <div className="space-y-4">
        {myCerts.map((c) => (
          <GlassCard key={c.id} className="flex justify-between items-center">
            <p>{c.eventName}</p>
            <div className="flex gap-3">
              <Badge status={c.status} />
              {c.status === "pending_upload" && (
                <Button
                  size="sm"
                  icon={Upload}
                  onClick={() => {
                    setSelectedCert(c.id);
                    setUploadOpen(true);
                  }}
                >
                  Upload
                </Button>
              )}
            </div>
          </GlassCard>
        ))}
        <FileUploadModal
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onUpload={uploadFile}
        />
      </div>
    );
  }

  return null;
}
