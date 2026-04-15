import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const { data } = await API.post("/users/login", {
                email,
                password,
            });

            // 🔥 TOKEN SAVE
            localStorage.setItem("token", data.token);
            localStorage.setItem("isAdmin", data.isAdmin);

            // 🔥 ROLE BASED REDIRECT
            if (data.isAdmin) {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            alert("Login failed");
        }
    };

    return (
        <form onSubmit={submitHandler}>
            <h2>Login</h2>

            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>
        </form>
    );
};

export default Login;