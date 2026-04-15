import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth"; // 👈 NEW (Login + Register combined)
import Cart from "./pages/Cart";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public (Auth page for both login & register) */}
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/cart" element={<Cart />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;