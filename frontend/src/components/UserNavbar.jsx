import { useNavigate } from "react-router-dom";
import "../pages/Home.css";

const UserNavbar = ({ cart }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="user-navbar">
      <div className="brand">
        <span>🛍️</span> ShopApp
      </div>

      <button className="nav-btn" onClick={() => navigate("/")}>
        Home
      </button>

      <button className="cart-btn" onClick={() => navigate("/cart")}>
        🛒 Cart
        {cart.length > 0 && <span className="badge">{cart.length}</span>}
      </button>

      <button className="logout-btn" onClick={logoutHandler}>
        Logout
      </button>
    </nav>
  );
};

export default UserNavbar;