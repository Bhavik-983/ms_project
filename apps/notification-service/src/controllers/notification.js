import {
  NotificationModel,
  consumeQueue,
  errorHelper,
  messages,
  sendBadRequest,
  sendSuccess,
} from "@myorg/common";

async function createNotification(data) {
  try {
    console.log(data, "notification data");

    await new NotificationModel(data).save();
  } catch (e) {
    console.error("Error creating notification", e);
  }
}
consumeQueue("notification_queue", createNotification);

export const getNotifications = async (req, res) => {
  try {
    const notification = await NotificationModel.find({
      fk_receiver_id: req.user._id,
    });
    return sendSuccess(res, notification);
  } catch (e) {
    return sendBadRequest(e, errorHelper(e, "GET_NOTIFICATION"));
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await NotificationModel.findOne({
      _id: req.params.notificationId,
      fk_receiver_id: req.user._id,
    });
    if (!notification)
      return sendBadRequest(res, messages.notificationNotFound);
    notification.remove();
    return sendSuccess(res, messages.notificationDeleted);
  } catch (e) {
    return sendBadRequest(e, errorHelper(e, "GET_NOTIFICATION"));
  }
};
