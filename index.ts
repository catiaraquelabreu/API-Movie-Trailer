import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes";
import movieRoutes from "./src/routes/movieRoutes";
import path from "path";

require("dotenv").config();

const app = express();
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/movie-trailer-api";

const connectionOptions: ConnectOptions = {};

mongoose
  .connect(MONGO_URI, connectionOptions)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use(cors());
app.use(express.json());

app.use("/static", express.static(path.join(__dirname, "static")));

app.use("/auth", authRoutes);
app.use("/api/movies", movieRoutes);

const PORT = process.env.PORT || 7500;

app.listen(PORT, () => {
  console.log(`Servidor a correr na port: ${PORT} Bom trabalho`);
});
