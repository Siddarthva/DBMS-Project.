import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/auth/register";


export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
    dept: "",
    sem: "",
    section: ""
  });

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API, form);
      alert(res.data.message);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
        dept: "",
        sem: "",
        section: ""
      });
    } catch (err) {
      alert("Signup Failed!");
      console.error(err.response?.data);
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
            name="name" placeholder="Full Name"
            value={form.name} onChange={update} />

          <input className="w-full p-2 rounded text-black"
            type="email" placeholder="Email"
            name="email" value={form.email} onChange={update} />

          <input className="w-full p-2 rounded text-black"
            type="password" placeholder="Password"
            name="password" value={form.password} onChange={update} />

          <select className="w-full p-2 rounded text-black"
            name="role" value={form.role} onChange={update}>
            <option value="STUDENT">Student</option>
            <option value="MENTOR">Mentor</option>
            <option value="HOD">HOD</option>
          </select>

          {form.role === "STUDENT" && (
            <>
              <input className="w-full p-2 rounded text-black"
                name="dept" placeholder="Department ID (Number)"
                value={form.dept} onChange={update} />

              <input className="w-full p-2 rounded text-black"
                name="sem" placeholder="Semester"
                value={form.sem} onChange={update} />

              <input className="w-full p-2 rounded text-black"
                name="section" placeholder="Section"
                value={form.section} onChange={update} />
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
