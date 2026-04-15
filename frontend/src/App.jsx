import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home cart={cart} addToCart={addToCart} />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={<Cart cart={cart} removeFromCart={removeFromCart} />}
        />

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