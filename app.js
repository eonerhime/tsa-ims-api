require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const PORT = process.env.PORT;
const app = express();
// Import routes
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", productRoute);
app.use("/api", userRoute);

// Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
