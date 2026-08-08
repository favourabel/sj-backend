import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ==================== ROUTE IMPORTS ====================
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";   // ✅ ADD THIS

dotenv.config();

mongoose.set("bufferCommands", false);
mongoose.set("bufferTimeoutMS", 10000);

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
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ------------------------------------------------------------------ */
/*  Routes                                                            */
/* ------------------------------------------------------------------ */

app.get("/", (req, res) => {
  res.json({ message: "✅ SJ Backend API is running" });
});

app.use("/api/auth", authRoutes);           // ✅ Added /api prefix
app.use("/api/projects", projectRoutes);    // ✅ Added /api prefix

/* ------------------------------------------------------------------ */
/*  404 Handler — catch any unmatched routes                          */
/* ------------------------------------------------------------------ */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* ------------------------------------------------------------------ */
/*  Global Error Handler                                              */
/* ------------------------------------------------------------------ */

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

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