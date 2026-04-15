import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, adminOnly }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // ❌ Not admin but trying admin route
  if (adminOnly && isAdmin !== "true") {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;