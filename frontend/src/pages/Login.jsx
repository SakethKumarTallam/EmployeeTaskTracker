// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api";
// import { useAuth } from "../AuthContext";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     try {
//       const res = await api.post("/auth/login", { email, password });
//       login(res.data);
//       navigate("/"); // go to dashboard
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Login failed");
//     }
//   }

//   return (
//     <div className="page">
//       <h1>Login</h1>
//       <form className="task-form" onSubmit={handleSubmit}>
//         {error && <p className="error-message">{error}</p>}
//         <div className="form-row">
//           <label>Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div className="form-row">
//           <label>Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <button type="submit">Log in</button>
//       </form>
//     </div>
//   );
// }


// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      login(res.data); // { token, user }
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Login Page</h1>
        <p className="login-subtitle">
          Sign in to view your dashboard and tasks.
        </p>

        {error && <p className="error-message login-error">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email: </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password: </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn-primary login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* <p className="login-hint">
            Try your seeded users, e.g. <strong>alice@example.com</strong>
          </p> */}
        </form>
      </div>
    </div>
  );
}
