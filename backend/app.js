const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const produtoRoutes = require("./src/routes/produtoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/produtos", produtoRoutes);

module.exports = app;