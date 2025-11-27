import React, { useState, useEffect } from "react";
import Student from "./components/Student";
import Mentor from "./components/Mentor";
import Hod from "./components/Hod";
import Signup from "./components/Signup";
import { Badge } from "./ui";
import {
  Award,
  Trophy,
  Calendar,
  LayoutDashboard,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showSignup, setShowSignup] = useState(true);

  // Fetch users list from DB
  async function loadUsers() {
    try {
      const res = await fetch("http://localhost:5000/api/users/list"); 
      const data = await res.json();
      setUsers(data);
    } catch {
      setUsers([]);
    }
    setLoadingUsers(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUserSelect = (id) => {
    const selectedUser = users.find((u) => u.user_id === Number(id));
    setUser(selectedUser);
    setView("dashboard");
    setShowSignup(false);
  };

  const logout = () => {
    setUser(null);
    setShowSignup(true);
  };

  const USER_MENUS = {
    STUDENT: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "events", label: "Events", icon: Calendar },
      { id: "history", label: "My Certificates", icon: FileText },
    ],
    MENTOR: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "pending", label: "Pending Review", icon: Award },
      { id: "approved", label: "History", icon: FileText },
    ],
    HOD: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "approvals", label: "Final Approvals", icon: Award },
      { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    ],
  };

  const renderView = () => {
    if (!user) return null;
    if (user.role === "STUDENT") return <Student user={user} view={view} />;
    if (user.role === "MENTOR") return <Mentor user={user} view={view} />;
    if (user.role === "HOD") return <Hod user={user} view={view} />;
  };

  // START PAGE — Signup + Select User
  if (!user && showSignup) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">
          CertiFlow System
        </h1>

        {/* Signup form */}
        <Signup
          onSuccess={() => {
            loadUsers();
            setShowSignup(false);
          }}
        />

        <div className="mt-10 text-center">
          <h3 className="font-semibold mb-2 text-gray-300">
            OR Login as existing user
          </h3>
          {loadingUsers ? (
            <p className="text-gray-400">Loading users...</p>
          ) : (
            <select
              className="bg-slate-800 border border-white/20 p-2 rounded mt-2 w-64 text-white"
              onChange={(e) => handleUserSelect(e.target.value)}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.user_id} value={u.user_id}>
                  {u.name} — {u.role}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-slate-900/70 backdrop-blur-lg border-r border-white/10 fixed md:static h-full
        transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 font-bold text-xl flex gap-2 items-center">
          <Award className="text-blue-400" /> CertiFlow
        </div>

        <nav className="px-3 space-y-2">
          {USER_MENUS[user.role].map((menu) => (
            <button
              key={menu.id}
              onClick={() => {
                setView(menu.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left
                ${
                  view === menu.id
                    ? "bg-blue-600/30 text-blue-300 border border-blue-500/50"
                    : "text-gray-300 hover:bg-white/10"
                }`}
            >
              <menu.icon size={18} />
              {menu.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 w-full px-4">
          <button
            onClick={logout}
            className="flex items-center gap-3 text-rose-300 hover:bg-rose-500/10 w-full px-4 py-2 rounded-lg"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-slate-900/40 border-b border-white/10 p-4 flex justify-between items-center">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>

          <h2>
            {USER_MENUS[user.role].find((m) => m.id === view).label}
          </h2>

          <div className="flex items-center gap-2">
            {user.name}
            <Badge status={user.role.toLowerCase()} />
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X />
            </button>
          </div>
        </header>

        <section className="p-6 overflow-y-auto">{renderView()}</section>
      </main>
    </div>
  );
}
