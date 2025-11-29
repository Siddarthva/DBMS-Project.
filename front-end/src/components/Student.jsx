import React, { useState, useEffect } from "react";
import { GlassCard, Button } from "./ui.jsx";
import { UploadCloud, FileUp, CheckCircle, ChevronDown, Loader2 } from "lucide-react";
import axios from "axios";

export default function Student({ user, view }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [participationId, setParticipationId] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load Events From DB
  useEffect(() => {
    axios.get("http://localhost:5000/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error("Failed to load events", err));
  }, []);

  // Step 1: Create participation
  const submitParticipation = async () => {
    if (!selectedEvent) return alert("Select an event!");

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/participations", {
        event_id: selectedEvent,
        student_id: user.user_id,
        role: "PARTICIPANT"
      });

      setParticipationId(res.data.participation_id);
      alert("Participation Created! Now upload certificate.");
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Upload certificate file
  const uploadCertificate = async () => {
    if (!file) return alert("Please select a file");
    if (!participationId) return alert("Register event participation first!");

    setLoading(true);

    const formData = new FormData();
    formData.append("certificate", file); // MUST MATCH Backend
    formData.append("participation_id", participationId);

    try {
      const res = await axios.post(
        `http://localhost:5000/certificates/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(res.data.message || "Uploaded!");
      setFile(null);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Only show this on Certificate History Page
  if (view !== "history") return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">
          Upload Certificate
        </h2>
        <p className="text-slate-400">Add your proof for validation</p>
      </div>

      <GlassCard className="relative">
        {/* STEP 1 */}
        <div className={`p-6 rounded-xl border ${participationId ? "border-emerald-500/30" : "border-white/10"}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-10 h-10 rounded-lg font-bold flex items-center justify-center text-white ${participationId ? "bg-emerald-600" : "bg-blue-600"}`}>1</div>
            <span className="text-white font-semibold">Select Event</span>
            {participationId && <CheckCircle className="text-emerald-400 ml-auto" />}
          </div>

          <div className="flex gap-4">
            <select
              className="bg-slate-900 border border-white/20 text-white rounded-xl px-3 py-2 flex-1"
              disabled={participationId}
              value={selectedEvent}
              onChange={e => setSelectedEvent(e.target.value)}
            >
              <option value="">Choose Event...</option>
              {events.map(ev => (
                <option key={ev.event_id} value={ev.event_id}>
                  {ev.name}
                </option>
              ))}
            </select>

            {!participationId && (
              <Button
                onClick={submitParticipation}
                disabled={!selectedEvent || loading}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Register"}
              </Button>
            )}
          </div>
        </div>

        {/* STEP 2 */}
        <div className={`mt-6 p-6 rounded-xl border ${participationId ? "border-white/10" : "opacity-40 pointer-events-none border-white/20"}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold">2</div>
            <span className="text-white font-semibold">Upload Proof</span>
          </div>

          <label className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center cursor-pointer group">
            <input
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={e => setFile(e.target.files[0])}
            />

            <UploadCloud className="mx-auto mb-3 text-blue-400" size={32} />
            <span className="text-white">{file ? file.name : "Click to select PDF"}</span>
          </label>

          <Button
            className="w-full mt-4"
            variant="success"
            icon={FileUp}
            onClick={uploadCertificate}
            disabled={!file || loading}
          >
            {loading ? "Uploading..." : "Submit Certificate"}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
