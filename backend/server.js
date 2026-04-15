require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();

// ✅ Body parser
app.use(express.json());

// ✅ CORS (FINAL FIX - ALL VERCEL + LOCAL)
app.use(
  cors({
    origin: true, // 🔥 allow all origins (best for deployment)
    credentials: true,
  })
);

// ✅ Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});