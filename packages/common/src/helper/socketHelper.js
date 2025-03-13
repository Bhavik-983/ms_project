import { isValidUser } from "../middleware/user_validator/index.js";
import { ChatModel } from "../database/models/chat.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
const users = new Map(); // To store active users

let io;
export const ioHandler = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  console.log("Socket connection started");

  io.use(isValidUser).on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);
    users.set(socket.userId, socket.id);

    // 🔥 Send Message
    socket.on("sendMessage", async (data) => {
      try {
        if (!mongoose.Types.ObjectId(socket.userId).equals(data.receiverId)) {
          // 1. Save message to MongoDB
          const newMessage = await new ChatModel({
            fk_sender_id: socket.userId,
            fk_receiver_id: data.receiverId,
            message: data.message,
            media_url: data.media_url,
            media_type: data.media_type,
          }).save();

          // 2. Emit to receiver if online
          const receiverSocketId = users.get(data.receiverId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", newMessage);
          }
        }

        // 3. Emit to sender for confirmation
        // socket.emit("messageDelivered", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("typing", (data) => {
      if (!mongoose.Types.ObjectId(socket.userId).equals(data.receiverId)) {
        const receiverSocketId = users.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("userTyping", socket.userId);
        }
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      users.delete(socket.userId);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO is not initialized!");
  }
  return io;
};

export const getUserSocket = async (userId) => {
  return await users.get(userId);
};
