import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
// ... your other imports

dotenv.config();

const app = express();

/* ------------------------------------------------------------------ */
/*  CORS Configuration — allows both localhost & production frontend  */
/* ------------------------------------------------------------------ */

const allowedOrigins = [
  "http://localhost:5173",              // Vite dev server
  "http://localhost:3000",              // CRA dev server (if used)
  "https://sjwebs.vercel.app",          // Your live frontend
  process.env.FRONTEND_URL,             // From .env (extra safety)
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked: ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ------------------------------------------------------------------ */
/*  Middleware                                                        */
/* ------------------------------------------------------------------ */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ------------------------------------------------------------------ */
/*  Routes                                                            */
/* ------------------------------------------------------------------ */

app.get("/", (req, res) => {
  res.json({ message: "✅ SJ Backend API is running" });
});

app.use("/auth", authRoutes);
// app.use("/projects", projectRoutes);  // your other routes

/* ------------------------------------------------------------------ */
/*  Database Connection                                               */
/* ------------------------------------------------------------------ */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ------------------------------------------------------------------ */
/*  Start Server                                                      */
/* ------------------------------------------------------------------ */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});