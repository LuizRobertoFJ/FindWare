const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/authRoutes");
const produtoRoutes = require("./src/routes/produtoRoutes");

const app = express();

app.use(cors({
  origin: "https://find-ware.vercel.app",
  credentials: true,
}));


app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/auth", authRoutes);
app.use("/produtos", produtoRoutes);

module.exports = app;