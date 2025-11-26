// src/App.jsx
import React, { useState } from "react";
import Student from "./components/Student";
import Mentor from "./components/Mentor";
import Hod from "./components/Hod";
import Login from "./components/Login";
import { USERS } from "./mockData";
import { Badge } from "./ui";
import { LayoutDashboard, FileText, Award, Trophy, Calendar, LogOut, Menu, X } from "lucide-react";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onLogin = (email, role) => {
    const loggedUser = USERS.find(
      u => u.email === email && u.role === role
    );
    if (loggedUser) {
      setUser(loggedUser);
      setView("dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    setView("dashboard");
  };

  if (!user) return <Login onLogin={onLogin} />;

  const USER_MENUS = {
    student: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "events", label: "Events", icon: Calendar },
      { id: "history", label: "My Certificates", icon: FileText },
    ],
    mentor: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "pending", label: "Pending Review", icon: Award },
      { id: "approved", label: "History", icon: FileText },
    ],
    hod: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "approvals", label: "Final Approvals", icon: Award },
      { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    ],
  };

  const renderView = () => {
    if (user.role === "student") return <Student user={user} view={view} />;
    if (user.role === "mentor") return <Mentor user={user} view={view} />;
    if (user.role === "hod") return <Hod user={user} view={view} />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`w-64 bg-slate-900/70 backdrop-blur-xl border-r border-white/10 
        fixed md:static h-full transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        
        <div className="p-6 font-bold text-lg flex items-center gap-2">
          <Award size={24} className="text-blue-400" />
          CertiFlow
        </div>

        <nav className="p-4 space-y-2">
          {USER_MENUS[user.role].map(menu => (
            <button key={menu.id}
              onClick={() => { setView(menu.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                ${view === menu.id ? "bg-blue-600/30 text-blue-300 border border-blue-500/50"
                  : "text-gray-300 hover:bg-white/10"}`}>
              <menu.icon size={18} />
              {menu.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 text-rose-300 hover:bg-rose-500/20 px-4 py-2 rounded-lg"
            onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 px-4 md:px-8 bg-slate-900/30 border-b border-white/10 
          flex items-center justify-between">
          
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>

          <h1 className="text-lg">{USER_MENUS[user.role].find(m => m.id === view).label}</h1>

          <div className="flex items-center gap-3">
            <span className="flex gap-1 text-sm">
              {user.name}
              <Badge status={user.role} />
            </span>

            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X />
            </button>
          </div>
        </header>

        <section className="p-4 md:p-8 overflow-y-auto">
          {renderView()}
        </section>
      </main>
    </div>
  );
}
