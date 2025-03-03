import sgMail from "../utilities/sgMail.js";
import { sendBadRequest } from "../utilities/index.js";
import { errorHelper } from "./errorHelper.js";

// SEND TEXT MAIL
export const sendTextMail = async (to, from, subject, text, attachments) => {
  try {
    return await sgMail.send({
      to,
      from,
      subject,
      text,
      attachments,
    });
  } catch (e) {
    return sendBadRequest(e, errorHelper(errorHelper, "SEND_TEXT_MAIL"));
  }
};
