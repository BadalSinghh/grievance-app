import { useState } from "react";
import axios from "axios";

function Register({ setPage }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://grievance-app-he3q.onrender.com/api/register",
        form,
      );
      setMsg(res.data.message);
      setTimeout(() => setPage("login"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <br />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <br />
        <button type="submit" style={btnStyle}>
          Register
        </button>
      </form>
      {msg && <p>{msg}</p>}
      <p>
        Already have an account?{" "}
        <button onClick={() => setPage("login")} style={linkStyle}>
          Login
        </button>
      </p>
    </div>
  );
}

const containerStyle = {
  maxWidth: "400px",
  margin: "80px auto",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};
const inputStyle = {
  width: "100%",
  padding: "8px",
  margin: "8px 0",
  boxSizing: "border-box",
};
const btnStyle = {
  padding: "10px 20px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const linkStyle = {
  background: "none",
  border: "none",
  color: "blue",
  cursor: "pointer",
  textDecoration: "underline",
};

export default Register;
