const express = require("express");
const session = require("express-session");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Adjust origin to match your React app

// Session setup
app.use(
  session({
    secret: "your-secret-key", // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set true for HTTPS
  })
);

// Login Route (Stores JWT in session)
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Forward request to backend API
    const response = await axios.post("http://localhost:8080/login", {
      username,
      password,
    });

    // Store JWT token in session
    req.session.jwt = response.data.token; // Assuming API returns { token: "JWT-TOKEN" }

    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: "Login failed" });
  }
});

// Middleware to Forward Requests with JWT
app.use(async (req, res) => {
  console.log(req.session.jwt, 'Token is');
  if (!req.session.jwt) {
    return res.status(401).json({ error: "Unauthorized: No Token" });
  }

  try {
    // Forward the request to port 8080 with JWT token
    const apiResponse = await axios({
      method: req.method,
      url: `http://localhost:8080${req.originalUrl}`,
      headers: {
        Authorization: `Bearer ${req.session.jwt}`,
        "Content-Type": "application/json",
      },
      data: req.body, // Forward request body
    });

    res.status(apiResponse.status).json(apiResponse.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Middleware running on http://localhost:${PORT}`));
