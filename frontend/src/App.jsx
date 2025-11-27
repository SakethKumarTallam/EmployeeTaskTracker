// // src/App.jsx
// import "./App.css";
// import { Routes, Route, Navigate } from "react-router-dom";

// import Navbar from "./Components/Navbar.jsx";
// import Footer from "./Components/Footer.jsx";

// import Dashboard from "./pages/Dashboard.jsx";
// import Tasks from "./pages/Tasks.jsx";
// import Employees from "./pages/Employees.jsx";
// import Login from "./pages/Login.jsx";

// import { useAuth } from "./AuthContext";

// // Reusable protected route
// function PrivateRoute({ children, roles }) {
//   const { user } = useAuth();

//   // not logged in → go to login
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // if roles is provided, check authorization
//   if (roles && !roles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }

// export default function App() {
//   // Navbar already uses useAuth internally, so we don't *need* to pass props
//   // but passing is harmless; if your Navbar signature doesn't take them, you can remove them.
//   const { user, logout } = useAuth();

//   return (
//     <div className="app">
//       <Navbar user={user} onLogout={logout} />

//       <main className="app-main">
//         <Routes>
//           {/* Public route */}
//           <Route path="/login" element={<Login />} />

//           {/* Dashboard: AVAILABLE FOR ALL AUTHENTICATED USERS */}
//           <Route
//             path="/"
//             element={
//               <PrivateRoute>
//                 <Dashboard />
//               </PrivateRoute>
//             }
//           />

//           {/* Tasks: admin + user */}
//           <Route
//             path="/tasks"
//             element={
//               <PrivateRoute roles={["admin", "user"]}>
//                 <Tasks />
//               </PrivateRoute>
//             }
//           />

//           {/* Employees: admin only */}
//           <Route
//             path="/employees"
//             element={
//               <PrivateRoute roles={["admin"]}>
//                 <Employees />
//               </PrivateRoute>
//             }
//           />

//           {/* Fallback: any unknown route → dashboard if logged in, else login */}
//           <Route
//             path="*"
//             element={
//               <PrivateRoute>
//                 <Dashboard />
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//       </main>

//       <Footer />
//     </div>
//   );
// }

import Navbar from "./Components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Footer from "./Components/Footer.jsx";
import Employees from "./pages/Employees.jsx";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login.jsx";

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <Navbar user={user} onLogout={logout} />

      <main className="app-main">
        <Routes>
          {/* if already logged in, don't show login page */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />

          {/* home → Dashboard for everyone */}
          <Route
            path="/"
            element={
              <PrivateRoute roles={["admin", "user"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <PrivateRoute roles={["admin", "user"]}>
                <Tasks />
              </PrivateRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <PrivateRoute roles={["admin"]}>
                <Employees />
              </PrivateRoute>
            }
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

