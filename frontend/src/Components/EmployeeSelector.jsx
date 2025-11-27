// src/Components/EmployeeSelector.jsx
export default function EmployeeSelector({
  employees,
  selectedEmployeeId,
  onChange,
}) {
  return (
    <div className="filter-group">
      <label>Employee:</label>
      <select
        value={selectedEmployeeId || ""}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">All</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.name}
          </option>
        ))}
      </select>
    </div>
  );
}
