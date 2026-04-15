import { useEffect, useState } from "react";
import API from "../services/api";
import UserNavbar from "../components/UserNavbar";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await API.get("/products");
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // 🔥 Add to Cart
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div className="home-page">
      <UserNavbar cart={cart} />

      <div className="home-hero">
        <h1>Discover Products</h1>
        <p>Browse our curated collection and find what you love.</p>
      </div>

      <div className="products-section">
        <h2>All Products</h2>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No products available yet.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <div key={p._id} className="product-card">
                <div className="card-image-wrap">
                  {p.image ? (
                    <img src={p.image} alt={p.name} />
                  ) : (
                    <span className="no-image">🛍️</span>
                  )}
                </div>
                <div className="card-body">
                  <div className="card-name">{p.name}</div>
                  {p.description && (
                    <div className="card-desc">{p.description}</div>
                  )}
                  <div className="card-footer">
                    <span className="card-price">₹{p.price}</span>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(p)}
                    >
                      + Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;