import { useState, useEffect } from "react";
import API from "../services/api";
import "./AdminDashboard.css";

const STATUS_COLORS = {
  pending: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "rgba(245,158,11,0.3)" },
  confirmed: { bg: "rgba(99,102,241,0.12)", color: "#818cf8", border: "rgba(99,102,241,0.3)" },
  delivered: { bg: "rgba(34,197,94,0.12)", color: "#4ade80", border: "rgba(34,197,94,0.3)" },
};

const AdminDashboard = () => {
  const [tab, setTab] = useState("home");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({ name: "", price: "", image: "", description: "" });
  const [editId, setEditId] = useState(null);

  // ── Fetch helpers ──────────────────────────────────────────
  const fetchProducts = async () => {
    const { data } = await API.get("/products");
    setProducts(data);
  };

  const fetchOrders = async () => {
    const { data } = await API.get("/orders");
    setOrders(data);
  };

  const fetchUsers = async () => {
    const { data } = await API.get("/users");
    setUsers(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  // ── Product handlers ───────────────────────────────────────
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (editId) {
      await API.put(`/products/${editId}`, form);
    } else {
      await API.post("/products", form);
    }
    setForm({ name: "", price: "", image: "", description: "" });
    setEditId(null);
    fetchProducts();
    setTab("products");
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  const editHandler = (p) => {
    setForm(p);
    setEditId(p._id);
    setTab("add");
  };

  // ── Order status handler ───────────────────────────────────
  const updateStatus = async (orderId, status) => {
    await API.put(`/orders/${orderId}/status`, { status });
    fetchOrders();
  };

  const logoutHandler = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ── Derived stats ──────────────────────────────────────────
  const totalRevenue = orders
    .filter((o) => o.status !== "pending")
    .reduce((s, o) => s + o.totalPrice, 0);

  return (
    <div className="admin-layout">
      {/* NAVBAR */}
      <nav className="admin-navbar">
        <div className="brand">⚙️ <span>Admin</span> Panel</div>

        {[
          { key: "home",     label: "🏠 Home" },
          { key: "products", label: "📦 Products" },
          { key: "manage",   label: "🛠 Manage" },
          { key: "orders",   label: "🛒 Orders" },
          { key: "users",    label: "👥 Users" },
          { key: "add",      label: "➕ Add" },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={tab === key ? "active" : ""}
            onClick={() => {
              if (key === "add") { setEditId(null); setForm({ name: "", price: "", image: "", description: "" }); }
              setTab(key);
            }}
          >
            {label}
          </button>
        ))}

        <button className="logout-btn" onClick={logoutHandler}>Logout</button>
      </nav>

      <div className="admin-content">

        {/* ── HOME ── */}
        {tab === "home" && (
          <div className="admin-welcome">
            <h2>Welcome back, Admin 👑</h2>
            <p>Here's a quick overview of your store.</p>
            <div className="admin-stats">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-value">{products.length}</div>
                <div className="stat-label">Products</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-value">{orders.length}</div>
                <div className="stat-label">Orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{users.length}</div>
                <div className="stat-label">Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-value">₹{totalRevenue}</div>
                <div className="stat-label">Revenue</div>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS VIEW ── */}
        {tab === "products" && (
          <>
            <div className="section-header">
              <h2>All Products</h2>
            </div>
            {products.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">📦</div><p>No products yet.</p></div>
            ) : (
              <div className="products-grid">
                {products.map((p) => (
                  <div key={p._id} className="product-card">
                    <div className="card-image-placeholder">
                      {p.image ? <img className="card-image" src={p.image} alt={p.name} /> : <span>🛍️</span>}
                    </div>
                    <div className="card-body">
                      <div className="card-name">{p.name}</div>
                      <div className="card-price">₹{p.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── MANAGE ── */}
        {tab === "manage" && (
          <>
            <div className="section-header"><h2>Manage Products</h2></div>
            {products.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🛠</div><p>No products to manage.</p></div>
            ) : (
              <div className="manage-list">
                {products.map((p) => (
                  <div key={p._id} className="manage-item">
                    <div className="item-info">
                      <div className="item-name">{p.name}</div>
                      <div className="item-price">₹{p.price}</div>
                    </div>
                    <div className="item-actions">
                      <button className="btn edit-btn btn-sm" onClick={() => editHandler(p)}>✏️ Edit</button>
                      <button className="btn delete-btn btn-sm" onClick={() => deleteHandler(p._id)}>🗑 Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ORDERS ── */}
        {tab === "orders" && (
          <>
            <div className="section-header"><h2>All Orders</h2></div>
            {orders.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🛒</div><p>No orders yet.</p></div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => {
                  const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                  return (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div className="order-meta">
                          <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                          <span className="order-user">👤 {order.userName || "Unknown"}</span>
                          <span className="order-email">{order.userEmail}</span>
                          <span className="order-date">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="order-right">
                          <span
                            className="status-badge"
                            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                          >
                            {order.status}
                          </span>
                          <span className="order-total">₹{order.totalPrice}</span>
                        </div>
                      </div>

                      <div className="order-items">
                        {order.items.map((item, i) => (
                          <div key={i} className="order-item-row">
                            <span className="oi-name">{item.name}</span>
                            <span className="oi-price">₹{item.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="order-actions">
                        <span className="status-label">Update status:</span>
                        {["pending", "confirmed", "delivered"].map((s) => (
                          <button
                            key={s}
                            className={`status-btn ${order.status === s ? "status-btn-active" : ""}`}
                            onClick={() => updateStatus(order._id, s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── USERS ── */}
        {tab === "users" && (
          <>
            <div className="section-header"><h2>All Users</h2></div>
            {users.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">👥</div><p>No users found.</p></div>
            ) : (
              <div className="users-table-wrap">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id}>
                        <td className="td-num">{i + 1}</td>
                        <td className="td-name">{u.name}</td>
                        <td className="td-email">{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.isAdmin ? "role-admin" : "role-user"}`}>
                            {u.isAdmin ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="td-date">
                          {new Date(u.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── ADD / EDIT ── */}
        {tab === "add" && (
          <div className="admin-form-wrapper">
            <h2>{editId ? "✏️ Edit Product" : "➕ Add New Product"}</h2>
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <label>Product Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Wireless Headphones" required />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input name="price" value={form.price} onChange={handleChange} placeholder="e.g. 1999" type="number" required />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input name="description" value={form.description} onChange={handleChange} placeholder="Short product description" />
              </div>
              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: "8px" }}>
                {editId ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
