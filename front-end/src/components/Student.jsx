import React, { useState, useEffect } from "react";
import { GlassCard, Button } from "./ui.jsx";
import { 
  UploadCloud, 
  FileUp, 
  CheckCircle, 
  ChevronDown, 
  Loader2 
} from "lucide-react";

export default function Student({ user, view }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [participationId, setParticipationId] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load events student can select
  useEffect(() => {
    fetch("http://localhost:5000/events", {
      headers: { Authorization: `Bearer test` } // remove auth later
    })
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Failed to load events", err));
  }, []);

  // Step-1: Create Participation Entry
  const submitParticipation = async () => {
    if (!selectedEvent) return alert("Select an event");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/participations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer test` // remove auth later
        },
        body: JSON.stringify({
          event_id: selectedEvent,
          role: "PARTICIPANT"
        })
      });

      const data = await res.json();
      if (data.id) {
        setParticipationId(data.id);
        // alert("Participation registered! Now upload certificate.");
      } else {
        alert("Error creating participation!");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step-2: Upload PDF
  const uploadCertificate = async () => {
    if (!file || !participationId)
      return alert("Create participation first!");
    
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `http://localhost:5000/certificates/upload/${participationId}`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Only render if view is 'history' (matching your original logic)
  if (view !== "history") return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">Upload Certificate</h2>
        <p className="text-slate-400">Submit your achievement proofs for verification</p>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="space-y-8 relative z-10">
            {/* Step 1: Select Event */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${participationId ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-950/50 border-white/10'}`}>
                <div className="flex items-center gap-4 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg transition-colors ${participationId ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-blue-600 text-white shadow-blue-500/20'}`}>
                        1
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-white">Select Event</h3>
                        <p className="text-xs text-slate-400">Choose the event you participated in</p>
                    </div>
                    {participationId && <CheckCircle className="text-emerald-400 ml-auto" size={24} />}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <select
                            className="w-full bg-slate-900 border border-white/10 p-3 pl-4 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 outline-none disabled:opacity-50 appearance-none transition-all hover:bg-slate-800 cursor-pointer"
                            onChange={e => setSelectedEvent(e.target.value)}
                            disabled={!!participationId}
                            value={selectedEvent}
                        >
                            <option value="">Select an event from list...</option>
                            {events.map(ev => (
                                <option key={ev.event_id} value={ev.event_id}>
                                    {ev.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 text-slate-500 pointer-events-none group-hover:text-blue-400 transition-colors" size={16} />
                    </div>

                    {!participationId && (
                        <Button 
                            onClick={submitParticipation} 
                            variant="primary" 
                            disabled={loading || !selectedEvent}
                            className="w-full sm:w-auto"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Register"}
                        </Button>
                    )}
                </div>
            </div>

            {/* Step 2: Upload Proof */}
            <div className={`p-6 rounded-2xl border transition-all duration-500 ${participationId ? 'bg-slate-950/50 border-white/10 opacity-100 translate-y-0' : 'opacity-40 pointer-events-none grayscale translate-y-4'}`}>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-sm text-white border border-white/10">
                        2
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-white">Upload Proof</h3>
                        <p className="text-xs text-slate-400">Attach your certificate PDF</p>
                    </div>
                </div>

                <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:bg-slate-800/30 hover:border-slate-500 transition-all group cursor-pointer relative">
                     <input
                        type="file"
                        accept="application/pdf"
                        id="file-upload"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        onChange={e => setFile(e.target.files[0])}
                        disabled={!participationId}
                    />
                    <div className="flex flex-col items-center gap-4 relative z-10">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
                             <UploadCloud className="text-blue-400" size={32} />
                        </div>
                        <div>
                            <span className="text-slate-200 font-medium block text-lg">
                                {file ? file.name : "Click to upload PDF"}
                            </span>
                            <span className="text-sm text-slate-500">Maximum file size 5MB</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                     <Button 
                        onClick={uploadCertificate} 
                        variant="success" 
                        icon={FileUp} 
                        disabled={!file || loading}
                        className="w-full sm:w-auto shadow-lg shadow-emerald-900/20"
                     >
                        {loading ? "Uploading..." : "Submit Certificate"}
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}