import React from "react";
import { X, FileText, Loader2 } from "lucide-react";

// --- Glassmorphism Card ---
export const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:border-white/10 ${className}`}>
    {children}
  </div>
);

// --- Aesthetic Button ---
export const Button = ({ children, onClick, variant = "primary", icon: Icon, className = "", disabled }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 border border-white/10",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5",
    outline: "bg-transparent border border-white/10 hover:bg-white/5 text-slate-300",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20",
    danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20",
    ghost: "hover:bg-white/5 text-slate-400 hover:text-white"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {Icon && <Icon size={18} className="stroke-[2.5]" />}
      {children}
    </button>
  );
};

// --- Status Badge ---
export const Badge = ({ status }) => {
  const styles = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20 ring-amber-500/10",
    pending_mentor: "bg-orange-500/10 text-orange-400 border-orange-500/20 ring-orange-500/10",
    pending_hod: "bg-violet-500/10 text-violet-400 border-violet-500/20 ring-violet-500/10",
    approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-emerald-500/10",
    rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20 ring-rose-500/10",
    student: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    mentor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    hod: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
  };

  const label = status?.replace("_", " ").toUpperCase() || "UNKNOWN";

  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider border shadow-sm ring-1 ring-inset ${styles[status] || "bg-slate-800 text-slate-400 border-slate-700"}`}>
      {label}
    </span>
  );
};

// --- PDF Preview Modal ---
export const PDFPreviewModal = ({ open, cert, onClose }) => {
  if (!open || !cert) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#0f172a] border border-white/10 w-full max-w-5xl h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/10">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-slate-900/50">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <FileText className="text-blue-400" size={20} />
              Certificate Preview
            </h3>
            <p className="text-xs text-slate-400 mt-1">Student: <span className="text-slate-200">{cert.studentName}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 bg-slate-950/50 flex flex-col items-center justify-center p-8 relative">
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f61a_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
            
            <div className="bg-slate-900 border border-white/10 p-12 rounded-2xl text-center space-y-6 max-w-md w-full shadow-2xl z-10">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto ring-4 ring-blue-500/5">
                  <FileText size={40} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">{cert.eventName}</h4>
                  <p className="text-slate-400 text-sm">This is a placeholder for the actual PDF file viewer.</p>
                </div>
                
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs font-mono text-slate-500 break-all bg-slate-950 p-3 rounded-lg border border-white/5">
                    {cert.file_url || "No URL provided"}
                  </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};