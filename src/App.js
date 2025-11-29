import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [section, setSection] = useState("welcome");
  const STORAGE_KEY = "feedbacks";
  const [feedbacks, setFeedbacks] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    id: "",
    dept: "",
    year: "",
    course: "",
    faculty: "",
    teach: "5",
    comm: "5",
    clarity: "5",
    overall: "5",
    comments: "",
  });

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setFeedbacks(JSON.parse(stored));
  }, []);

  // Save feedbacks to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
  }, [feedbacks]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT FEEDBACK
  const submitFeedback = () => {
    if (!form.name || !form.id || !form.course || !form.faculty) {
      alert("Please fill Student Name, ID, Course and Faculty Name.");
      return;
    }
    const newFeedback = {
      id: "f_" + Date.now(),
      ...form,
      ratings: {
        teachingQuality: Number(form.teach),
        communicationSkills: Number(form.comm),
        clarityExplanation: Number(form.clarity),
        overallSatisfaction: Number(form.overall),
      },
      createdAt: new Date().toISOString(),
    };
    setFeedbacks([newFeedback, ...feedbacks]);
    alert("✅ Feedback submitted!");
    setForm({
      name: "",
      id: "",
      dept: "",
      year: "",
      course: "",
      faculty: "",
      teach: "5",
      comm: "5",
      clarity: "5",
      overall: "5",
      comments: "",
    });
    setSection("home");
  };

  // DELETE ONE FEEDBACK
  const deleteFeedback = (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    setFeedbacks(feedbacks.filter((f) => f.id !== id));
  };

  // DELETE ALL FEEDBACKS
  const clearAll = () => {
    if (!window.confirm("Delete all feedbacks?")) return;
    setFeedbacks([]);
  };

  const filtered = feedbacks.filter(
    (f) =>
      f.faculty.toLowerCase().includes(search.toLowerCase()) ||
      f.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">

      {/* ---------------- WELCOME PAGE ONLY ---------------- */}
      {section === "welcome" && (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <h1 style={{ fontSize: "32px", color: "var(--accent)" }}>
            WELCOME TO STUDENT FEEDBACK SYSTEM
          </h1>
          <p style={{ fontSize: "16px", color: "var(--muted)" }}>
            Please continue to proceed.
          </p>

          {/* Go to Home Button */}
          <button
            className="btn"
            style={{ marginTop: "30px" }}
            onClick={() => setSection("home")}
          >
            Go to Home →
          </button>
        </div>
      )}

      {/* ---------------- HEADER + MENU (HIDDEN IN WELCOME) ---------------- */}
      {section !== "welcome" && (
        <>
          <h1>Student Feedback System</h1>
          <p className="lead">
            Submit feedback, view results (admin) — stored in{" "}
            <strong>LocalStorage</strong>.
          </p>

          {/* MENU BUTTONS */}
          <div className="menu">
            <button className="btn" onClick={() => setSection("home")}>
              Home
            </button>
            <button className="btn alt" onClick={() => setSection("student")}>
              Student
            </button>
            <button className="btn alt" onClick={() => setSection("adminLogin")}>
              Admin
            </button>
          </div>
        </>
      )}

      {/* ---------------- HOME PAGE (Instructions only once) ---------------- */}
      {section === "home" && (
        <div className="note">
          <strong>How it works:</strong>
          <ol>
            <li>Students submit the feedback form.</li>
            <li>Data is saved inside browser LocalStorage.</li>
            <li>Admin can view/delete feedbacks.</li>
          </ol>
        </div>
      )}

      {/* ---------------- STUDENT FEEDBACK FORM ---------------- */}
      {section === "student" && (
        <div>
          <h3>Student Feedback Form</h3>
          <div className="row">
            <div className="col">
              <label>Student Name</label>
              <input name="name" value={form.name} onChange={handleChange} />

              <label>Student ID</label>
              <input name="id" value={form.id} onChange={handleChange} />

              <label>Department</label>
              <input name="dept" value={form.dept} onChange={handleChange} />

              <label>Year / Semester</label>
              <input name="year" value={form.year} onChange={handleChange} />
            </div>

            <div className="col">
              <label>Course Name</label>
              <input name="course" value={form.course} onChange={handleChange} />

              <label>Faculty Name</label>
              <input name="faculty" value={form.faculty} onChange={handleChange} />

              <label>Teaching Quality (1-5)</label>
              <select name="teach" value={form.teach} onChange={handleChange}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>

              <label>Communication Skills (1-5)</label>
              <select name="comm" value={form.comm} onChange={handleChange}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <label>Comments</label>
          <textarea
            name="comments"
            value={form.comments}
            onChange={handleChange}
          />

          <div style={{ marginTop: "10px" }}>
            <button className="btn" onClick={submitFeedback}>
              Submit
            </button>
            <button className="btn alt" onClick={() => setSection("home")}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ---------------- ADMIN LOGIN ---------------- */}
      {section === "adminLogin" && !admin && (
        <div>
          <h3>Admin Login</h3>
          <input id="user" placeholder="admin" />
          <input id="pass" type="password" placeholder="admin123" />
          <button
            className="btn"
            onClick={() => {
              const user = document.getElementById("user").value;
              const pass = document.getElementById("pass").value;
              if (user === "admin" && pass === "admin123") {
                setAdmin(true);
                setSection("admin");
              } else alert("Invalid Credentials");
            }}
          >
            Login
          </button>
        </div>
      )}

      {/* ---------------- ADMIN DASHBOARD ---------------- */}
      {section === "admin" && admin && (
        <div>
          <h3>Admin Dashboard</h3>

          <div className="flex-right">
            <input
              className="search"
              placeholder="Search faculty/course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="action-btn" onClick={clearAll}>
              Delete All
            </button>

            <button
              className="btn alt"
              onClick={() => {
                setAdmin(false);
                setSection("home");
              }}
            >
              Logout
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Course</th>
                <th>Faculty</th>
                <th>Ratings</th>
                <th>Comments</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8">No feedbacks available</td>
                </tr>
              ) : (
                filtered.map((f, i) => (
                  <tr key={f.id}>
                    <td>{i + 1}</td>
                    <td>
                      {f.name} ({f.id})
                    </td>
                    <td>{f.course}</td>
                    <td>{f.faculty}</td>
                    <td>
                      T:{f.ratings.teachingQuality} | C:{f.ratings.communicationSkills} | Cl:
                      {f.ratings.clarityExplanation} | O:
                      {f.ratings.overallSatisfaction}
                    </td>
                    <td>{f.comments}</td>
                    <td>{new Date(f.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => deleteFeedback(f.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
