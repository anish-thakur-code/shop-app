import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const resetForm = () => {
        setForm({ name: "", email: "", password: "" });
        setError("");
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            if (isLogin) {
                const { data } = await API.post("/users/login", {
                    email: form.email,
                    password: form.password,
                });

                localStorage.setItem("token", data.token);
                localStorage.setItem("isAdmin", data.isAdmin);

                resetForm();

                if (data.isAdmin) {
                    navigate("/admin");
                } else {
                    navigate("/");
                }

            } else {
                await API.post("/users/register", form);

                resetForm();
                setIsLogin(true);
            }

        } catch (err) {
            setError(isLogin ? "Invalid email or password." : "Registration failed. Please try again.");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* Brand */}
                <div className="auth-brand">
                    <div className="logo-icon">🛍️</div>
                    <h1>ShopApp</h1>
                    <p>{isLogin ? "Welcome back! Sign in to continue." : "Create your account to get started."}</p>
                </div>

                {/* Tabs */}
                <div className="auth-tabs">
                    <button
                        type="button"
                        className={isLogin ? "active" : ""}
                        onClick={() => { setIsLogin(true); resetForm(); }}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={!isLogin ? "active" : ""}
                        onClick={() => { setIsLogin(false); resetForm(); }}
                    >
                        Register
                    </button>
                </div>

                {/* Form */}
                <form className="auth-form" onSubmit={submitHandler}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                name="name"
                                value={form.name}
                                placeholder="John Doe"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            placeholder="you@example.com"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="auth-submit-btn">
                        {isLogin ? "Sign In" : "Create Account"}
                    </button>
                </form>

                {/* Toggle */}
                <div className="auth-toggle">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={() => { setIsLogin(!isLogin); resetForm(); }}>
                        {isLogin ? "Register" : "Login"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Auth;