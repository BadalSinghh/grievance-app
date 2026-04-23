import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [page, setPage] = useState("login");
  const token = localStorage.getItem("token");

  if (token && page !== "dashboard") {
    return <Dashboard setPage={setPage} />;
  }

  return (
    <div>
      {page === "login" && <Login setPage={setPage} />}
      {page === "register" && <Register setPage={setPage} />}
      {page === "dashboard" && <Dashboard setPage={setPage} />}
    </div>
  );
}

export default App;
