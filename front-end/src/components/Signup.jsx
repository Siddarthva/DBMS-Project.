import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/users/add";


export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
    dept_id: "",
    sem: "",
    section: ""
  });

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API, form);
      alert("User Registered! ID: " + res.data.user_id);
      
      // Reset form
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
      alert("Signup failed: " + err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-slate-800 p-6 rounded-xl shadow-xl w-full max-w-md">

        <h2 className="text-2xl font-bold mb-4 text-center text-blue-400">
          Register New User
        </h2>

        <form className="space-y-3" onSubmit={submitSignup}>
          <input className="w-full p-2 rounded text-black" 
            placeholder="Full Name" 
            name="name" value={form.name} onChange={updateField} />

          <input className="w-full p-2 rounded text-black" 
            placeholder="Email" 
            type="email" name="email" 
            value={form.email} onChange={updateField} />

          <input className="w-full p-2 rounded text-black" 
            placeholder="Password"
            type="password" name="password"
            value={form.password} onChange={updateField} />

          <select className="w-full p-2 rounded text-black"
            name="role" value={form.role} onChange={updateField}>
            <option value="STUDENT">Student</option>
            <option value="MENTOR">Mentor</option>
            <option value="HOD">HOD</option>
          </select>

          {/* Student-specific fields */}
          {form.role === "STUDENT" && (
            <>
              <input className="w-full p-2 rounded text-black" 
                placeholder="Department ID"
                name="dept_id" value={form.dept_id} onChange={updateField} />

              <input className="w-full p-2 rounded text-black" 
                placeholder="Semester"
                name="sem" value={form.sem} onChange={updateField} />

              <input className="w-full p-2 rounded text-black" 
                placeholder="Section"
                name="section" value={form.section} onChange={updateField} />
            </>
          )}

          <button className="bg-blue-500 hover:bg-blue-600 w-full p-2 rounded-xl font-semibold">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
