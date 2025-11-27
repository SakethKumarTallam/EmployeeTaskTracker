// src/pages/Tasks.jsx
import { useEffect, useState } from "react";
import api from "../api";
import EmployeeSelector from "../Components/EmployeeSelector.jsx";
import StatusFilter from "../Components/StatusFilter.jsx";
import TaskForm from "../Components/TaskForm.jsx";
import TaskList from "../Components/TaskList.jsx";
import { useAuth } from "../AuthContext";

export default function Tasks() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEmployees() {
    if (!isAdmin) return; // users don't need all employees

    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load employees");
    }
  }

  async function loadTasks() {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (selectedStatus) params.status = selectedStatus;
      if (selectedEmployeeId) params.employeeId = selectedEmployeeId;

      const res = await api.get("/tasks", { params });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, [isAdmin]);

  useEffect(() => {
    loadTasks();
  }, [selectedStatus, selectedEmployeeId]);

  return (
    <div className="page tasks-page">
      <h1>Tasks</h1>

      <div className="filters-row">
        {isAdmin && (
          <EmployeeSelector
            employees={employees}
            selectedEmployeeId={selectedEmployeeId}
            onChange={setSelectedEmployeeId}
          />
        )}
        <StatusFilter
          selectedStatus={selectedStatus}
          onChange={setSelectedStatus}
        />
      </div>

      <div className={`tasks-layout ${isAdmin ? "tasks-layout-admin" : ""}`}>
        <div className="tasks-list-section">
          {loading ? (
            <p>Loading tasks...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <TaskList tasks={tasks} onTaskUpdated={loadTasks} />
          )}
        </div>

        {isAdmin && (
          <div className="tasks-form-section">
            <TaskForm employees={employees} onTaskCreated={loadTasks} />
          </div>
        )}
      </div>
    </div>
  );
}
