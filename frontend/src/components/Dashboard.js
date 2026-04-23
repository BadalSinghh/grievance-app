import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://grievance-app-he3q.onrender.com/api/grievances";

function Dashboard({ setPage }) {
  const [grievances, setGrievances] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Academic",
  });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "Academic",
    status: "Pending",
  });
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");
  const student = JSON.parse(localStorage.getItem("student"));

  const headers = { Authorization: token };

  const fetchGrievances = async (searchTerm = "") => {
    try {
      const url = searchTerm ? `${API}?title=${searchTerm}` : API;
      const res = await axios.get(url, { headers });
      setGrievances(res.data);
    } catch {
      localStorage.clear();
      setPage("login");
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const submitGrievance = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API, form, { headers });
      setMsg("Grievance submitted!");
      setForm({ title: "", description: "", category: "Academic" });
      fetchGrievances();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  const deleteGrievance = async (id) => {
    if (!window.confirm("Delete this grievance?")) return;
    try {
      await axios.delete(`${API}/${id}`, { headers });
      setMsg("Deleted!");
      fetchGrievances();
    } catch {
      setMsg("Error deleting");
    }
  };

  const startEdit = (g) => {
    setEditId(g._id);
    setEditForm({
      title: g.title,
      description: g.description,
      category: g.category,
      status: g.status,
    });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/${editId}`, editForm, { headers });
      setMsg("Updated!");
      setEditId(null);
      fetchGrievances();
    } catch {
      setMsg("Error updating");
    }
  };

  const logout = () => {
    localStorage.clear();
    setPage("login");
  };

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Welcome, {student?.name}</h2>
        <button onClick={logout} style={{ ...btnStyle, background: "#dc3545" }}>
          Logout
        </button>
      </div>

      {msg && <p style={{ color: "green", fontWeight: "bold" }}>{msg}</p>}

      {/* Submit Grievance */}
      <div style={cardStyle}>
        <h3>Submit Grievance</h3>
        <form onSubmit={submitGrievance}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            style={inputStyle}
          />
          <br />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            style={{ ...inputStyle, height: "80px" }}
          />
          <br />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={inputStyle}
          >
            <option>Academic</option>
            <option>Hostel</option>
            <option>Transport</option>
            <option>Other</option>
          </select>
          <br />
          <button type="submit" style={btnStyle}>
            Submit
          </button>
        </form>
      </div>

      {/* Search */}
      <div style={cardStyle}>
        <h3>Search Grievances</h3>
        <input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, width: "70%" }}
        />
        <button
          onClick={() => fetchGrievances(search)}
          style={{ ...btnStyle, marginLeft: "10px" }}
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearch("");
            fetchGrievances();
          }}
          style={{ ...btnStyle, marginLeft: "10px", background: "#6c757d" }}
        >
          Clear
        </button>
      </div>

      {/* Grievance List */}
      <div style={cardStyle}>
        <h3>My Grievances ({grievances.length})</h3>
        {grievances.length === 0 && <p>No grievances found.</p>}
        {grievances.map((g) => (
          <div
            key={g._id}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "10px",
            }}
          >
            {editId === g._id ? (
              <form onSubmit={submitEdit}>
                <input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  style={inputStyle}
                />
                <br />
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  style={{ ...inputStyle, height: "60px" }}
                />
                <br />
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  style={inputStyle}
                >
                  <option>Academic</option>
                  <option>Hostel</option>
                  <option>Transport</option>
                  <option>Other</option>
                </select>
                <br />
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  style={inputStyle}
                >
                  <option>Pending</option>
                  <option>Resolved</option>
                </select>
                <br />
                <button type="submit" style={btnStyle}>
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditId(null)}
                  style={{
                    ...btnStyle,
                    background: "#6c757d",
                    marginLeft: "8px",
                  }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <p>
                  <strong>{g.title}</strong> —{" "}
                  <span
                    style={{
                      color: g.status === "Resolved" ? "green" : "orange",
                    }}
                  >
                    {g.status}
                  </span>
                </p>
                <p>{g.description}</p>
                <p>
                  <small>
                    Category: {g.category} | Date:{" "}
                    {new Date(g.date).toLocaleDateString()}
                  </small>
                </p>
                <button
                  onClick={() => startEdit(g)}
                  style={{ ...btnStyle, background: "#ffc107", color: "#000" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteGrievance(g._id)}
                  style={{
                    ...btnStyle,
                    background: "#dc3545",
                    marginLeft: "8px",
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ccc",
  padding: "16px",
  borderRadius: "8px",
  marginBottom: "20px",
};
const inputStyle = {
  width: "100%",
  padding: "8px",
  margin: "6px 0",
  boxSizing: "border-box",
};
const btnStyle = {
  padding: "8px 16px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Dashboard;
