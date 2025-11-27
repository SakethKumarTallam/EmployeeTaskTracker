// src/Components/StatusFilter.jsx
const STATUSES = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

export default function StatusFilter({ selectedStatus, onChange }) {
  return (
    <div className="filter-group">
      <label>Status:</label>
      <select
        value={selectedStatus || ""}
        onChange={(e) => onChange(e.target.value || "")}
      >
        {STATUSES.map((s) => (
          <option key={s.value || "all"} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
