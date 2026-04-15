import { useState, useEffect } from "react";
import API from "../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [tab, setTab] = useState("home");
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);

  // 🔥 Fetch Products
  const fetchProducts = async () => {
    const { data } = await API.get("/products");
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔥 Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Add / Update
  const submitHandler = async (e) => {
    e.preventDefault();

    if (editId) {
      await API.put(`/products/${editId}`, form);
      alert("Updated");
    } else {
      await API.post("/products", form);
      alert("Added");
    }

    setForm({ name: "", price: "", image: "", description: "" });
    setEditId(null);
    fetchProducts();
  };

  // 🔥 Delete
  const deleteHandler = async (id) => {
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  // 🔥 Edit
  const editHandler = (p) => {
    setForm(p);
    setEditId(p._id);
    setTab("add");
  };

  // 🔥 Logout (NOW HERE ONLY)
  const logoutHandler = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="admin-layout">
      {/* ADMIN NAVBAR */}
      <nav className="admin-navbar">
        <div className="brand">⚙️ <span>Admin</span> Panel</div>

        <button
          className={tab === "home" ? "active" : ""}
          onClick={() => setTab("home")}
        >
          🏠 Home
        </button>
        <button
          className={tab === "products" ? "active" : ""}
          onClick={() => setTab("products")}
        >
          📦 Products
        </button>
        <button
          className={tab === "manage" ? "active" : ""}
          onClick={() => setTab("manage")}
        >
          🛠 Manage
        </button>
        <button
          className={tab === "add" ? "active" : ""}
          onClick={() => { setTab("add"); setEditId(null); setForm({ name: "", price: "", image: "", description: "" }); }}
        >
          ➕ Add Product
        </button>

        <button className="logout-btn" onClick={logoutHandler}>
          Logout
        </button>
      </nav>

      {/* TAB CONTENT */}
      <div className="admin-content">

        {/* HOME */}
        {tab === "home" && (
          <div className="admin-welcome">
            <h2>Welcome back, Admin 👑</h2>
            <p>Manage your store from the panel above.</p>
          </div>
        )}

        {/* PRODUCTS */}
        {tab === "products" && (
          <>
            <div className="section-header">
              <h2>All Products</h2>
            </div>
            {products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>No products yet. Add one!</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((p) => (
                  <div key={p._id} className="product-card">
                    <div className="card-image-placeholder">
                      {p.image ? (
                        <img className="card-image" src={p.image} alt={p.name} />
                      ) : (
                        <span>🛍️</span>
                      )}
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

        {/* MANAGE */}
        {tab === "manage" && (
          <>
            <div className="section-header">
              <h2>Manage Products</h2>
            </div>
            {products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛠</div>
                <p>No products to manage.</p>
              </div>
            ) : (
              <div className="manage-list">
                {products.map((p) => (
                  <div key={p._id} className="manage-item">
                    <div className="item-info">
                      <div className="item-name">{p.name}</div>
                      <div className="item-price">₹{p.price}</div>
                    </div>
                    <div className="item-actions">
                      <button className="btn edit-btn btn-sm" onClick={() => editHandler(p)}>
                        ✏️ Edit
                      </button>
                      <button className="btn delete-btn btn-sm" onClick={() => deleteHandler(p._id)}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ADD / EDIT */}
        {tab === "add" && (
          <div className="admin-form-wrapper">
            <h2>{editId ? "✏️ Edit Product" : "➕ Add New Product"}</h2>
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Wireless Headphones"
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 1999"
                  type="number"
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short product description"
                />
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