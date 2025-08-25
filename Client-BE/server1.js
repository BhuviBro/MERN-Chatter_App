import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"; // adjust path if needed
import authRoutes from "./routes/authRoutes.js"; // adjust path if needed
import messageRoutes from "./routes/messageRoutes.js"; // adjust path if needed
import userRoutes from "./routes/userRoutes.js"; // adjust path if needed

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",            // local frontend
      "https://mern-chatter-app.vercel.app", // production frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
