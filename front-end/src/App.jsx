import React, { useState, useEffect } from "react";
import { 
  Award, Trophy, Calendar, LayoutDashboard, FileText, LogOut, Menu, X, 
  UserCircle, CheckCircle, XCircle, Eye, Search, Inbox, History, 
  UploadCloud, FileUp, User, Lock, ChevronRight, Loader2, UserPlus, 
  Mail, ChevronDown, BookOpen, Medal, Shield, Sparkles
} from "lucide-react";
import axios from "axios";

// Re-using the improved UI components inline for the single-file requirement context
const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-white/10 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", icon: Icon, className = "", disabled }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 border border-white/10",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5",
    outline: "bg-transparent border border-white/10 hover:bg-white/5 text-slate-300",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20",
    danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20",
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {Icon && <Icon size={16} strokeWidth={2.5} />}
      {children}
    </button>
  );
};

const Badge = ({ status }) => {
  const styles = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    pending_mentor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    pending_hod: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    student: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    mentor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    hod: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
  };
  const label = status?.replace("_", " ").toUpperCase() || "UNKNOWN";
  return (
    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider border ${styles[status] || "bg-slate-800 text-slate-400 border-slate-700"}`}>
      {label}
    </span>
  );
};

const PDFPreviewModal = ({ open, cert, onClose }) => {
  if (!open || !cert) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#0f172a] border border-white/10 w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/10">
        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-slate-900/50">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <FileText className="text-blue-400" /> Certificate Details
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition text-slate-400 hover:text-white"><X size={20}/></button>
        </div>
        <div className="flex-1 bg-slate-950/50 flex items-center justify-center p-4 relative">
            <div className="text-center space-y-4 z-10">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-white/10">
                    <FileText size={32} className="text-slate-500" />
                </div>
                <div>
                    <p className="text-slate-400">Previewing certificate for</p>
                    <p className="text-white font-semibold text-lg">{cert.eventName}</p>
                </div>
                <p className="text-xs text-slate-600 font-mono bg-black/20 p-2 rounded border border-white/5">{cert.file_url || "No URL provided"}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- MOCK DATA ---
const USERS_MOCK = [
  { id: 1, user_id: 1, name: "Alice Student", role: "STUDENT", dept: "CSE", points: 120, email: "alice@college.edu" },
  { id: 2, user_id: 2, name: "Bob Student", role: "STUDENT", dept: "ECE", points: 90, email: "bob@college.edu" },
  { id: 3, user_id: 3, name: "Dr. Mentor", role: "MENTOR", dept: "CSE", email: "mentor@college.edu" },
  { id: 4, user_id: 4, name: "Prof. HOD", role: "HOD", dept: "CSE", email: "hod@college.edu" },
];

const INITIAL_CERTIFICATES = [
  { id: 101, studentName: "Alice Student", dept: "CSE", eventName: "Hackathon 2024", status: "pending_mentor", file_url: "#" },
  { id: 102, studentName: "Bob Student", dept: "ECE", eventName: "Robotics Workshop", status: "pending_hod", file_url: "#" },
  { id: 103, studentName: "Charlie", dept: "CSE", eventName: "Code Chef", status: "approved", file_url: "#" },
];

// --- AUTH COMPONENTS ---

function Signup({ onSuccess ,loadUsers }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STUDENT", dept_id: "", sem: "", section: "" });
  const [loading, setLoading] = useState(false);

  const updateField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const submitSignup = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:5000/api/users/add", form);

    alert("Account Created Successfully!");

    if (loadUsers) await loadUsers();
if (onSuccess) onSuccess();


    setForm({
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
      dept_id: "",
      sem: "",
      section: ""
    });

  } catch (err) {
    console.error(err);
    alert("Signup failed: " + (err.response?.data?.message || err.message));
  }

  setLoading(false);
};


  const inputClass = "w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all hover:bg-slate-900/80";

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <h2 className="text-xl font-bold mb-8 text-center text-white flex items-center justify-center gap-2 relative z-10">
        <UserPlus size={20} className="text-blue-400" /> 
        <span>New Account</span>
      </h2>

      <form className="space-y-5 relative z-10" onSubmit={submitSignup}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className={inputClass} placeholder="Full Name" name="name" value={form.name} onChange={updateField} required />
            <div className="relative">
                <input className={inputClass} placeholder="Email Address" type="email" name="email" value={form.email} onChange={updateField} required />
                <Mail className="absolute right-3 top-3.5 text-slate-500" size={16} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="relative">
                <input className={inputClass} placeholder="Password" type="password" name="password" value={form.password} onChange={updateField} required />
                <Lock className="absolute right-3 top-3.5 text-slate-500" size={16} />
            </div>

            <div className="relative">
                <select className={`${inputClass} appearance-none cursor-pointer`} name="role" value={form.role} onChange={updateField}>
                    <option value="STUDENT">Student</option>
                    <option value="MENTOR">Mentor</option>
                    <option value="HOD">HOD</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" size={16} />
            </div>
        </div>

        {form.role === "STUDENT" && (
            <div className="p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-4 animate-fade-in">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen size={14} /> Academic Info
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    <input className={inputClass} placeholder="Dept ID" name="dept_id" value={form.dept_id} onChange={updateField} required />
                    <input className={inputClass} placeholder="Sem" name="sem" value={form.sem} onChange={updateField} required />
                    <input className={inputClass} placeholder="Section" name="section" value={form.section} onChange={updateField} required />
                </div>
            </div>
        )}

        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-3.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">
          {loading ? "Creating Profile..." : "Register Account"}
        </button>
      </form>
    </div>
  );
}

// --- DASHBOARD COMPONENTS ---

function StudentDashboard({ user, view }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [participationId, setParticipationId] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/events", { headers: { Authorization: `Bearer test` } })
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(() => setEvents([{event_id: 1, name: "Mock Hackathon 2024"}, {event_id: 2, name: "Mock Robotics Workshop"}]));
  }, []);

  const submitParticipation = async () => {
    if (!selectedEvent) return alert("Select an event");
    setParticipationId(123);
    alert("Participation registered (Mock)! Now upload certificate.");
  };

  const uploadCertificate = async () => {
    if (!file || !participationId) return alert("Create participation first!");
    alert("Certificate Uploaded (Mock Success)!");
  };

  if (view !== "history") return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500 space-y-4">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center ring-1 ring-white/10">
            <Calendar size={32} className="opacity-50"/>
          </div>
          <p className="font-medium">Upcoming Events & Dashboard</p>
          <p className="text-xs text-slate-600 max-w-xs text-center">This section will display your active events and calendar.</p>
      </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">Upload Certificate</h2>
        <p className="text-slate-400">Submit your achievement proofs for verification</p>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="space-y-8 relative z-10">
            {/* Step 1 */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${participationId ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-950/50 border-white/10'}`}>
                <div className="flex items-center gap-4 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg ${participationId ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-blue-600 text-white shadow-blue-500/20'}`}>1</div>
                    <div>
                        <h3 className="font-semibold text-lg text-white">Select Event</h3>
                        <p className="text-xs text-slate-400">Choose the event you participated in</p>
                    </div>
                    {participationId && <CheckCircle className="text-emerald-400 ml-auto" size={24} />}
                </div>
                
                <div className="flex gap-4">
                    <div className="relative flex-1 group">
                        <select
                            className="w-full bg-slate-900 border border-white/10 p-3 pl-4 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 outline-none disabled:opacity-50 appearance-none transition-all hover:bg-slate-800"
                            onChange={e => setSelectedEvent(e.target.value)}
                            disabled={!!participationId}
                        >
                            <option value="">Select an event from list...</option>
                            {events.map(ev => <option key={ev.event_id} value={ev.event_id}>{ev.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 text-slate-500 pointer-events-none group-hover:text-blue-400 transition-colors" size={16} />
                    </div>

                    {!participationId && (
                        <Button onClick={submitParticipation} variant="primary">Register</Button>
                    )}
                </div>
            </div>

            {/* Step 2 */}
            <div className={`p-6 rounded-2xl border transition-all duration-500 ${participationId ? 'bg-slate-950/50 border-white/10 opacity-100 translate-y-0' : 'opacity-40 pointer-events-none grayscale translate-y-4'}`}>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-sm text-white border border-white/10">2</div>
                    <div>
                        <h3 className="font-semibold text-lg text-white">Upload Proof</h3>
                        <p className="text-xs text-slate-400">Attach your certificate PDF</p>
                    </div>
                </div>

                <div className="border-2 border-dashed border-slate-700 rounded-2xl p-10 text-center hover:bg-slate-800/30 hover:border-slate-500 transition-all group cursor-pointer">
                     <input type="file" accept="application/pdf" id="file-upload" className="hidden" onChange={e => setFile(e.target.files[0])} />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                             <UploadCloud className="text-blue-400" size={32} />
                        </div>
                        <div>
                            <span className="text-slate-200 font-medium block text-lg">{file ? file.name : "Click to upload PDF"}</span>
                            <span className="text-sm text-slate-500">Maximum file size 5MB</span>
                        </div>
                    </label>
                </div>

                <div className="mt-6 flex justify-end">
                     <Button onClick={uploadCertificate} variant="success" icon={FileUp} disabled={!file} className="w-full sm:w-auto">Submit Certificate</Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function MentorDashboard({ user, view }) {
  const [certs, setCerts] = useState(INITIAL_CERTIFICATES);
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState("");

  const deptCerts = certs.filter((c) => c.dept === user.dept);
  const pending = deptCerts.filter((c) => c.status === "pending_mentor");
  const history = deptCerts.filter((c) => c.status !== "pending_mentor");

  const approve = (id) => setCerts((prev) => prev.map((c) => c.id === id ? { ...c, status: "pending_hod" } : c));
  const reject = (id) => setCerts((prev) => prev.map((c) => c.id === id ? { ...c, status: "rejected" } : c));

  const display = (view === "pending" ? pending : history).filter((c) => c.studentName.toLowerCase().includes(search.toLowerCase()));

  if (view === "dashboard" || view === "pending") {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Inbox className="text-blue-400" /> Pending Review
                </h2>
                <p className="text-slate-400 mt-1">Review student submissions for your department</p>
            </div>
            <div className="relative w-full md:w-72 group">
                <Search className="absolute left-3 top-3 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                    className="bg-slate-900 border border-white/10 pl-10 pr-4 py-2.5 w-full rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    placeholder="Search by student name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        {display.length === 0 && (
          <div className="text-center py-24 bg-slate-900/30 rounded-3xl border border-dashed border-white/10">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox size={32} className="text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium">All caught up! No pending certificates.</p>
          </div>
        )}

        <div className="grid gap-4">
            {display.map((c) => (
            <GlassCard key={c.id} className="group hover:bg-slate-900/60 hover:border-blue-500/30">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center text-blue-400 font-bold text-xl border border-white/5 shadow-inner">
                            {c.studentName.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-lg text-white group-hover:text-blue-200 transition-colors">{c.studentName}</p>
                            <p className="text-sm text-slate-400">{c.eventName}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-500 border border-slate-700">Student ID: #8839</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto pl-14 lg:pl-0">
                        <Button variant="ghost" icon={Eye} onClick={() => setPreview(c)} className="flex-1 lg:flex-none">
                            Preview
                        </Button>
                        <div className="w-px h-8 bg-white/10 hidden lg:block mx-2"></div>
                        <Button icon={CheckCircle} variant="success" onClick={() => approve(c.id)} className="flex-1 lg:flex-none">
                            Approve
                        </Button>
                        <Button icon={XCircle} variant="danger" onClick={() => reject(c.id)} className="flex-1 lg:flex-none">
                            Reject
                        </Button>
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
        <History className="text-violet-400" /> History Log
      </h2>
      <div className="grid gap-3">
        {history.map((c) => (
            <div key={c.id} className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-slate-900/60 transition duration-300">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                     <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-sm font-bold border border-white/5">
                        {c.studentName.charAt(0)}
                    </div>
                    <div>
                        <span className="font-semibold text-slate-200 block">{c.studentName}</span>
                        <span className="text-xs text-slate-500">{c.eventName}</span>
                    </div>
                </div>
                <Badge status={c.status} />
            </div>
        ))}
      </div>
    </div>
  );
}

function HodDashboard({ user, view }) {
  const [certs, setCerts] = useState(INITIAL_CERTIFICATES);
  const [preview, setPreview] = useState(null);
  const pending = certs.filter((c) => c.status === "pending_hod");

  const finalize = (id, approve = true) =>
    setCerts((prev) => prev.map((c) => c.id === id ? { ...c, status: approve ? "approved" : "rejected" } : c));

  if (view === "dashboard" || view === "approvals") {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-end border-b border-white/5 pb-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Final Approvals</h2>
                <p className="text-slate-400 text-sm mt-1">Authorize certificates for release</p>
            </div>
            <div className="text-right bg-slate-900/50 px-5 py-3 rounded-2xl border border-white/5">
                <span className="text-2xl font-bold text-blue-400">{pending.length}</span>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Pending</p>
            </div>
        </div>

        {pending.length === 0 && (
             <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-white/10">
                <Shield size={48} className="mx-auto text-slate-700 mb-4" />
                <p className="text-slate-400 font-medium">No certificates awaiting signature.</p>
            </div>
        )}

        <div className="grid gap-5">
            {pending.map((c) => (
            <GlassCard key={c.id} className="relative overflow-hidden group border-l-4 border-l-blue-500 hover:shadow-blue-900/10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <FileText className="text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">{c.studentName}</h3>
                            <p className="text-sm text-slate-400">{c.eventName}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-end gap-3 w-full md:w-auto">
                        <div className="mr-auto md:mr-4 flex items-center">
                            <Badge status="pending_hod" />
                        </div>
                        <Button variant="outline" icon={Eye} onClick={() => setPreview(c)}>Review</Button>
                        <Button variant="success" icon={CheckCircle} onClick={() => finalize(c.id, true)}>Sign</Button>
                        <Button variant="danger" icon={XCircle} onClick={() => finalize(c.id, false)}>Deny</Button>
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
    const leaderboard = USERS_MOCK.filter(u => u.role === "STUDENT").sort((a, b) => b.points - a.points);
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center mb-10 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl"></div>
             <Trophy className="mx-auto text-yellow-500 mb-4 relative z-10 drop-shadow-lg" size={56} strokeWidth={1.5} />
             <h2 className="text-4xl font-bold text-white relative z-10">Top Performers</h2>
             <p className="text-slate-400 mt-2 relative z-10">Celebrating excellence in certification</p>
        </div>

        <div className="space-y-4">
            {leaderboard.map((s, i) => {
                let rankStyle = "bg-slate-900/40 border-white/5";
                let rankIcon = <span className="font-mono text-slate-600">#{i + 1}</span>;
                let scale = "hover:scale-[1.01]";
                
                if(i === 0) { 
                    rankStyle = "bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/20 shadow-lg shadow-yellow-900/10"; 
                    rankIcon = <Medal className="text-yellow-500 drop-shadow-md" size={24} />;
                    scale = "scale-[1.02] hover:scale-[1.03]";
                }
                if(i === 1) { 
                    rankStyle = "bg-gradient-to-r from-slate-300/10 to-transparent border-slate-300/20"; 
                    rankIcon = <Medal className="text-slate-300" size={22} />;
                }
                if(i === 2) { 
                    rankStyle = "bg-gradient-to-r from-orange-700/10 to-transparent border-orange-700/20"; 
                    rankIcon = <Medal className="text-orange-700" size={20} />;
                }

                return (
                    <div key={s.id} className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${rankStyle} ${scale}`}>
                        <div className="flex items-center gap-6">
                            <div className="w-10 flex justify-center">{rankIcon}</div>
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm border border-white/5">
                                {s.name.charAt(0)}
                            </div>
                            <div>
                                <p className={`font-bold text-lg ${i < 3 ? 'text-white' : 'text-slate-300'}`}>{s.name}</p>
                                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">{s.dept}</p>
                            </div>
                        </div>
                        <div className="text-right pr-4">
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

// --- ROOT COMPONENT ---

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showSignup, setShowSignup] = useState(true);

  async function loadUsers() {
    try {
      const res = await fetch("http://localhost:5000/api/users/list"); 
      const data = await res.json();
      setUsers(data);
    } catch { setUsers(USERS_MOCK); }
    setLoadingUsers(false);
  }

  useEffect(() => { loadUsers(); }, []);

  const handleUserSelect = (id) => {
    const selectedUser = users.find((u) => u.user_id === Number(id));
    setUser(selectedUser);
    setView("dashboard");
    setShowSignup(false);
  };

  const logout = () => { setUser(null); setShowSignup(true); };

  const USER_MENUS = {
    STUDENT: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "events", label: "Events", icon: Calendar },
      { id: "history", label: "My Certificates", icon: FileText },
    ],
    MENTOR: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "pending", label: "Pending Review", icon: Inbox },
      { id: "approved", label: "History Log", icon: History },
    ],
    HOD: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "approvals", label: "Final Approvals", icon: Shield },
      { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    ],
  };

  const renderView = () => {
    if (!user) return null;
    if (user.role === "STUDENT") return <StudentDashboard user={user} view={view} />;
    if (user.role === "MENTOR") return <MentorDashboard user={user} view={view} />;
    if (user.role === "HOD") return <HodDashboard user={user} view={view} />;
  };

  if (!user && showSignup) {
    return (
      <div className="min-h-screen bg-[#020617] text-white p-6 flex flex-col items-center justify-center relative overflow-hidden font-sans">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-md space-y-8 animate-fade-in z-10">
            <div className="text-center">
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-xl shadow-blue-500/20 ring-4 ring-blue-500/10">
                    <Award className="text-white w-10 h-10" />
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">CertiFlow</h1>
                <p className="text-slate-400 mt-2 text-lg">Next-Gen Certification System</p>
            </div>

            <Signup 
  onSuccess={() => setShowSignup(false)}
  loadUsers={loadUsers}
/>


            <div className="text-center pt-8 border-t border-white/5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    Developer Access (Mock)
                </h3>
                {loadingUsers ? (
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                        <Loader2 className="animate-spin" size={16} /> Syncing...
                    </div>
                ) : (
                    <div className="relative group mx-auto max-w-xs">
                        <select
                        className="w-full bg-slate-900/50 border border-white/10 p-3 pl-4 rounded-xl text-slate-300 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/50 outline-none transition-all hover:bg-slate-900 hover:text-white"
                        onChange={(e) => handleUserSelect(e.target.value)}
                        >
                        <option value="">Select a persona to explore...</option>
                        {users.map((u) => <option key={u.user_id} value={u.user_id}>{u.name} — {u.role}</option>)}
                        </select>
                        <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500 group-hover:text-blue-400 transition-colors">
                            <ChevronDown size={16} />
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className={`w-72 bg-slate-900/80 backdrop-blur-xl border-r border-white/5 fixed md:static h-full z-40 transition-all duration-300 ease-out ${sidebarOpen ? "translate-x-0 shadow-2xl shadow-black" : "-translate-x-full md:translate-x-0"}`}>
        <div className="h-20 flex items-center gap-3 px-6 border-b border-white/5 bg-slate-900/50">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/20">
                <Award className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">CertiFlow</span>
        </div>

        <div className="p-4 py-6">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Main Menu</div>
            <nav className="space-y-1">
            {USER_MENUS[user.role].map((menu) => (
                <button
                key={menu.id}
                onClick={() => { setView(menu.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
                    ${view === menu.id ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"}`}
                >
                <menu.icon size={18} className={view === menu.id ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"} />
                {menu.label}
                {view === menu.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>}
                </button>
            ))}
            </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/5 bg-slate-900/50">
          <button onClick={logout} className="flex items-center gap-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm border border-transparent hover:border-rose-500/10">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-slate-900/40 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-6 md:px-8 z-20">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-slate-400 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5" onClick={() => setSidebarOpen(true)}>
                <Menu size={20} />
            </button>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                {USER_MENUS[user.role].find((m) => m.id === view).icon && React.createElement(USER_MENUS[user.role].find((m) => m.id === view).icon, { size: 20, className: "text-blue-500" })}
                {USER_MENUS[user.role].find((m) => m.id === view).label}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-slate-400 font-mono">{user.email}</p>
            </div>
            <div className="relative">
                <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/10 overflow-hidden">
                    <span className="font-bold text-sm text-white">{user.name.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-0.5 border border-white/10">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
            </div>
          </div>
          
          {sidebarOpen && <div className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />}
        </header>

        <section className="flex-1 overflow-y-auto p-6 md:p-10 relative scroll-smooth">
            <div className="max-w-7xl mx-auto">
                {renderView()}
            </div>
        </section>
      </main>
    </div>
  );
}