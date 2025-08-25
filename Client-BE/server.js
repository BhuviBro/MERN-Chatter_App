import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

//Create express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initilaize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" },
});

// Store online users
export const userSocketMap = {}; // {userId : socketId}

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("✅ User Connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit Online users to all connected users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middle Ware Setup
app.use(express.json({ limit: "4mb" }));

app.use(
  cors({
    origin: ["https://mern-chatter-app.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes Setup
app.get("/api/status", (req, res) => res.send("Server is Live 🚀"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect DB and start server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`✅ Server running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
    process.exit(1);
  }
};

startServer();

// Export server (needed for Vercel serverless deployment, not Render)
export default server;
