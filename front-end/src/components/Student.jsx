import { useState, useEffect } from "react";

export default function Student({ user, view }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [participationId, setParticipationId] = useState(null);
  const [file, setFile] = useState(null);

  // Load events student can select
  useEffect(() => {
    fetch("http://localhost:5000/events", {
      headers: { Authorization: `Bearer test` } // remove auth later
    })
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  // Step-1: Create Participation Entry
  const submitParticipation = async () => {
    if (!selectedEvent) return alert("Select an event");

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
      alert("Participation registered! Now upload certificate.");
    } else {
      alert("Error creating participation!");
    }
  };

  // Step-2: Upload PDF
  const uploadCertificate = async () => {
    if (!file || !participationId)
      return alert("Create participation first!");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `http://localhost:5000/certificates/upload/${participationId}`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    alert(data.message);
  };

  if (view !== "history") return null;

  return (
    <div className="space-y-4 text-white">
      <h2 className="text-xl font-bold">Upload Certificate</h2>

      {/* Event Selection */}
      <select
        className="bg-black p-2 rounded border border-white/20"
        onChange={e => setSelectedEvent(e.target.value)}
      >
        <option value="">Select Event</option>
        {events.map(ev => (
          <option key={ev.event_id} value={ev.event_id}>
            {ev.name}
          </option>
        ))}
      </select>

      <button
        onClick={submitParticipation}
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Participation
      </button>

      {/* File Upload */}
      <input
        type="file"
        accept="application/pdf"
        className="bg-black p-2 rounded border border-white/20"
        onChange={e => setFile(e.target.files[0])}
      />

      <button
        onClick={uploadCertificate}
        className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
      >
        Upload Certificate
      </button>
    </div>
  );
}
