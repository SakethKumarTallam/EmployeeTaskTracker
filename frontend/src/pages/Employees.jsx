// src/pages/Employees.jsx
import { useEffect, useState } from "react";
import api from "../api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await api.get("/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load employees");
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="page">
      <h1>Employees</h1>
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.name}</td>
                  <td>{emp.role}</td>
                  <td>{emp.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
