import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// Create express app and HTTP server
const app = express();
const server = http.createServer(app);

// ✅ Configure allowed origins
const allowedOrigins = [
  "http://localhost:3000", // local frontend
  "http://localhost:5173", // vite dev frontend
  "https://mern-chatter-app-fyud.vercel.app", // deployed frontend
];

// Middleware Setup
app.use(express.json({ limit: "4mb" }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies / auth headers
  })
);

// Initialize socket.io server
export const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

// Store online users
export const userSocketMap = {}; // { userId : socketId }

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Routes Setup
app.use("/api/status", (req, res) => res.send("✅ Server is Live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB
await connectDB();

// Start server (only locally, Vercel handles prod)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log("🚀 Server running on PORT: " + PORT);
  });
}

// Export server for Vercel
export default server;
