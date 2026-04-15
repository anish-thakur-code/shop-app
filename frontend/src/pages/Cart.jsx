import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Cart.css";

const Cart = ({ cart = [], removeFromCart }) => {
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const checkoutHandler = async () => {
    if (cart.length === 0) return;
    setPlacing(true);
    try {
      await API.post("/orders", {
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          image: item.image || "",
        })),
        totalPrice: total,
      });
      setOrdered(true);
    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (ordered) {
    return (
      <div className="cart-page">
        <div className="order-success">
          <div className="success-icon">🎉</div>
          <h2>Order Placed!</h2>
          <p>Your order has been received and is being processed.</p>
          <button className="checkout-btn" style={{ marginTop: "28px" }} onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h2>Your Cart 🛒</h2>
        {cart.length > 0 && (
          <span className="cart-count">{cart.length} item{cart.length !== 1 ? "s" : ""}</span>
        )}
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
                  {item.description && (
                    <div className="item-desc">{item.description}</div>
                  )}
                </div>
                <div className="item-price">₹{item.price}</div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(index)}
                  title="Remove item"
                >
                  ✕
                </button>
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
            <button
              className="checkout-btn"
              onClick={checkoutHandler}
              disabled={placing}
            >
              {placing ? "Placing Order..." : "Proceed to Checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;