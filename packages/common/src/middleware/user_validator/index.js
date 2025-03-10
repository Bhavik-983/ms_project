import jwt from "jsonwebtoken";
import {
  sendBadRequest,
  sendBadRequestWith406Code,
} from "../../utilities/response/index.js";
import messages from "../../utilities/messages.js";
import config from "../../config/index.js";
import logger from "../../utilities/logger.js";
import { UserModel } from "../../database/index.js";
// import jwt from jwt

export const isUser = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      return sendBadRequestWith406Code(res, messages.authTokenRequired);
    }

    let tokenInfo = await jwt.verify(
      String(bearerToken).split(" ")[1],
      config.USER_SECRET
    );

    if (!tokenInfo || !tokenInfo._id) {
      return sendBadRequestWith406Code(res, messages.tokenFormatInvalid);
    }

    // Use the passed `models` directly
    const userDetails = await UserModel.findOne(
      { _id: tokenInfo._id },
      { access_token_id: 1, _id: 1, name: 1, profile_image: 1 }
    );

    if (!userDetails) {
      return sendBadRequest(res, messages.userNotFound);
    }

    if (tokenInfo.accessTokenId !== userDetails.access_token_id) {
      return sendBadRequestWith406Code(res, messages.invalidToken);
    }

    req.user = userDetails;
    next();
  } catch (e) {
    console.log(e);
    logger.error("IS_USER");
    if (String(e).includes("jwt expired")) {
      return sendBadRequestWith406Code(res, messages.tokenExpiredError);
    } else if (
      String(e).includes("invalid token") ||
      String(e).includes("jwt malformed")
    ) {
      return sendBadRequestWith406Code(res, messages.invalidToken);
    }
    logger.error(e);
    return sendBadRequest(res, messages.somethingGoneWrong);
  }
};
