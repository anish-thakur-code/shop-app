import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = ({ cart = [] }) => {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h2>Your Cart 🛒</h2>
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started.</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="item-number">{index + 1}</div>
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                </div>
                <div className="item-price">₹{item.price}</div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span className="total-price">₹{total}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;