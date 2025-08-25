import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// ----------------- Create Express app -----------------
const app = express();
const server = http.createServer(app);

// ----------------- CORS Setup -----------------
const allowedOrigins = [
  "https://mern-chatter-frontend.vercel.app", // your frontend URL
  "http://localhost:3000"                      // local dev
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ----------------- Socket.io -----------------
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

export const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ----------------- Middleware -----------------
app.use(express.json({ limit: "4mb" }));

// Test route for CORS check
app.get("/data", (req, res) => {
  res.json({ message: "CORS is working" });
});

// ----------------- Routes -----------------
app.use("/api/status", (req, res) => res.send("Server is Live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// ----------------- Connect MongoDB -----------------
await connectDB();

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

// ----------------- Export for Vercel -----------------
export default server;
