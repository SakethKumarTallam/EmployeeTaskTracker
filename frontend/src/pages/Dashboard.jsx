// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await api.get("/dashboard");
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!data) return null;

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <div className="cards">
        <div className="card">
          <h3>Total Tasks</h3>
          <p className="card-number">{data.totalTasks}</p>
        </div>
        <div className="card">
          <h3>Completed Tasks</h3>
          <p className="card-number">{data.completedTasks}</p>
        </div>
        <div className="card">
          <h3>Completion Rate</h3>
          <p className="card-number">
            {data.completionRate.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
