import {
  ChatModel,
  errorHelper,
  getIO,
  getUserSocket,
  messages,
  sendBadRequest,
  sendSuccess,
} from "@myorg/common";

export const sendMessage = async (req, res) => {
  try {
    const data = req.body;
    const newMessage = await new ChatModel({
      fk_sender_id: req.user._id,
      fk_receiver_id: req.params.receiverId,
      message: data.message,
      media_url: req.file.path, // Cloudinary URL is directly in req.file.path
      media_type: req.file.resource_type,
    }).save();

    // Emit message using socket.io
    const receiverSocketId = await getUserSocket(req.params.receiverId);
    if (receiverSocketId) {
      const io = getIO();
      io.to(receiverSocketId).emit("receiveMessage", newMessage);
    }
    return res
      .status(201)
      .json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const userData = await ChatModel.find({
      fk_sender_id: req.user._id,
      fk_receiver_id: req.params.receiverId,
    });
    const receiverData = await ChatModel.find({
      fk_receiver_id: req.user._id,
      fk_sender_id: req.params.receiverId,
    });
    return sendSuccess(
      res,
      { userData, receiverData },
      messages.chatGetSuccessfully
    );
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "GET_CHAT_HISTORY"));
  }
};

export const markAsRead = async (req, res) => {
  try {
    await ChatModel.updateMany(
      {
        fk_receiver_id: req.user._id,
        fk_sender_id: req.params.senderId,
        isRead: false,
      },
      { isRead: true }
    );
    return res.json({ success: true });
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "MARK_AS_READ"));
  }
};

export const unreadCount = async (req, res) => {
  try {
    const count = await ChatModel.countDocuments({
      fk_sender_id: req.params.senderId,
      fk_receiver_id: req.user._id,
      isRead: false,
    });
    return sendSuccess(res, count, messages.countGetSuccess);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "MARK_AS_READ"));
  }
};
