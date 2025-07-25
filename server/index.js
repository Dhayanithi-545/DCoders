// 1. Importing required packages
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import postsRouter from './routes/posts.js';

// 2. Load environment variables from .env file
dotenv.config();

// 3. Initialize the app
const app = express();

// 4. Middlewares to parse data and cookies
app.use(express.json()); // to read JSON in request body
app.use(cookieParser()); // to handle cookies
const allowedOrigins = [
  "http://localhost:5173",             // local dev
  "https://your-vercel-domain.vercel.app" // deployed frontend
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

// 5. Test route to check server is running
app.get("/", (req, res) => {
  res.send("Welcome to DCoders API 🎯");
});

// 6. Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("❌ MongoDB connection error:", error.message);
});
