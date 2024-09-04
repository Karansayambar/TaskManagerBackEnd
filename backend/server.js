// Package Imports
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require('cors')


// Files Imports
const db = require("./db"); // Assuming this connects to your MongoDB
const authRouter = require("./routes/authRouter");
const todoRouter = require("./routes/todoRouter");
require("dotenv").config();
const BASE_URL = process.env.BASE_URL;
// Constants
const app = express();
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not defined
const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: "sessions", // Correct collection name
});



// Middlewares
app.use(express.json()); // To parse JSON bodies
app.use(cors({
  origin : `${BASE_URL}`, //Frontend URL
  credentials : true // Allow credentials (cookies, headers)
}));
app.use(session({
  secret: process.env.SECRET_KEY,
  store: store,
  resave: false,
  saveUninitialized: false,
}));

app.use("/auth", authRouter);
app.use("/todo", todoRouter);

// Listener
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
