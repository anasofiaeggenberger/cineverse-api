import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import triviaRoutes from "./routes/triviaRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/trivia", triviaRoutes);

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
      w: "majority",
    });

    isConnected = true;
    console.log("✅ Conectado a MongoDB Atlas en Vercel");
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
  }
}

// --- Handler para Vercel ---
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}