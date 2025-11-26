// src/ui.js
import React, { useEffect, useState } from "react";
import { Upload, X, CheckCircle, XCircle, Award, Download } from "lucide-react";

export const GlassCard = ({ children, className = "", hover }) => (
  <div className={`bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 ${hover ? "hover:scale-[1.01] transition-all duration-300" : ""} ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, onClick, variant = 'primary', icon: Icon, className = "", loading }) => {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white",
    danger: "bg-rose-600 hover:bg-rose-500 text-white",
    outline: "border border-white/30 hover:bg-white/10 text-white",
  };
  return (
    <button onClick={onClick} className={`${styles[variant]} px-4 py-2 rounded-xl flex items-center gap-2 ${className}`}>
      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export const Badge = ({ status }) => {
  const style = {
    approved: "text-emerald-300 border-emerald-500/30",
    rejected: "text-rose-300 border-rose-500/30",
    pending_mentor: "text-amber-300 border-amber-500/30",
    pending_hod: "text-purple-300 border-purple-500/30",
    pending_upload: "text-blue-300 border-blue-500/30",
  };
  return (
    <span className={`px-3 py-1 border rounded-full text-xs font-semibold ${style[status]}`}>
      {status}
    </span>
  );
};

export const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 px-6 py-3 rounded-xl flex items-center gap-3 text-white ${type === "success" ? "bg-emerald-600" : "bg-rose-600"}`}>
      {type === "success" ? <CheckCircle /> : <XCircle />}
      {message}
    </div>
  );
};

export const FileUploadModal = ({ open, onUpload, onClose }) => {
  const [loading, setLoading] = useState(false);
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <GlassCard className="w-full max-w-md">
        <h3 className="text-white mb-4">Upload Certificate</h3>
        <input type="file" accept="application/pdf"
          onChange={(e) => {
            setLoading(true);
            setTimeout(() => {
              onUpload(e.target.files[0]);
              setLoading(false);
              onClose();
            }, 1000);
          }}
          className="text-white"
        />
        <Button onClick={onClose} className="mt-4">Close</Button>
      </GlassCard>
    </div>
  );
};

export const PDFPreviewModal = ({ open, cert, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <GlassCard className="w-full max-w-3xl h-[80vh] flex flex-col">
        <div className="flex justify-between">
          <h2>{cert.eventName}</h2>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
        <div className="flex-1 bg-white/80 mt-4 flex items-center justify-center text-black">
          PDF Preview Mock
        </div>
      </GlassCard>
    </div>
  );
};
