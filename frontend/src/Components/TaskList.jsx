// src/Components/TaskList.jsx
import api from "../api";
import { useAuth } from "../AuthContext";

export default function TaskList({ tasks, onTaskUpdated }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  async function handleStatusChange(taskId, newStatus) {
    if (!isAdmin) return;

    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      onTaskUpdated && onTaskUpdated();
    } catch (err) {
      console.error("Failed to update task", err);
      alert("Failed to update task status");
    }
  }

  if (!tasks.length) {
    return (
      <div className="task-card no-tasks-card">
        <p className="no-tasks-text">No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="task-card">
      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Employee</th>
            <th>Status</th>
            <th>Due Date</th>
            {isAdmin && <th>Change Status</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.employee?.name || "—"}</td>
              <td className={`status ${task.status}`}>{task.status}</td>
              <td>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "—"}
              </td>
              {isAdmin && (
                <td>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
