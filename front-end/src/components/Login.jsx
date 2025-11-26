// src/components/Login.jsx
import React, { useState, useEffect } from "react";
import { Award, User, Lock, ChevronRight } from "lucide-react";
import API from "../api"; // <-- Make sure api.js exists

export default function Login({ onLogin }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("student@college.edu");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role === "student") setEmail("student@college.edu");
    if (role === "mentor") setEmail("mentor@college.edu");
    if (role === "hod") setEmail("hod@college.edu");
  }, [role]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
        role
      });

      // Save token + user in browser
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onLogin(data.user); // Pass user to App
    } catch (err) {
      alert("Invalid Credentials or Role does not match!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 blur-3xl"></div>

      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 
        p-8 rounded-2xl w-full max-w-md shadow-xl z-20">

        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 
            w-16 h-16 flex items-center justify-center rounded-xl mx-auto mb-4 shadow-xl">
            <Award className="text-white" size={32} />
          </div>
          <p className="text-xl font-bold text-white">CertiFlow</p>
          <p className="text-gray-300 text-sm mt-1">Academic Certificate Portal</p>
        </div>

        <form className="space-y-5" onSubmit={submit}>
          {/* Role Switch */}
          <div className="grid grid-cols-3 gap-2 bg-slate-900/50 p-1 rounded-xl border border-white/10">
            {["student", "mentor", "hod"].map((r) => (
              <button key={r} type="button"
                onClick={() => setRole(r)}
                className={`py-2 rounded-lg text-sm capitalize transition 
                ${role === r ? "bg-blue-600/40 text-white" : "text-gray-400 hover:text-white"}`}>
                {r}
              </button>
            ))}
          </div>

          {/* Email Input */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              className="w-full bg-slate-900/60 rounded-xl border border-white/10 py-2.5 pl-10 pr-4 text-white"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              className="w-full bg-slate-900/60 rounded-xl border border-white/10 py-2.5 pl-10 pr-4 text-white"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 flex items-center justify-center gap-2 font-medium">
            {loading ? "Processing..." : <>Sign In <ChevronRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
