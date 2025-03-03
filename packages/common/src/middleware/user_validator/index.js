import jwt from "jsonwebtoken";
import {
  sendBadRequest,
  sendBadRequestWith406Code,
} from "../../utilities/response/index.js";
import messages from "../../utilities/messages.js";
import config from "../../config/index.js";
import logger from "../../utilities/logger.js";
// import jwt from jwt

export const isUser = async (req, res, next) => {
  try {
    // find token in headers
    const bearerToken = req.headers.authorization;
    // if token find then verify
    if (!bearerToken)
      return sendBadRequestWith406Code(res, messages.authTokenRequired);

    const tokenInfo = await jwt.verify(
      String(bearerToken).split(" ")[1],
      config.USER_SECRET
    );
    // token and token id find next step
    if (!tokenInfo && !tokenInfo.id)
      return sendBadRequestWith406Code(res, messages.tokenFormatInvalid);

    const userDetails = await req.app.get("models").UserModel.findOne(
      { _id: tokenInfo.id },
      {
        access_token_id: 1,
        _id: 1,
      }
    );

    // Admin Does not exist
    if (!userDetails) {
      return sendBadRequest(res, messages.userNotFound);
    }

    if (tokenInfo.accessTokenId !== userDetails.access_token_id)
      return sendBadRequestWith406Code(res, messages.invalidToken)``;
    // Attach Admin Info
    req.user = userDetails;

    // next for using this method only
    next();
  } catch (e) {
    console.log(e);
    logger.error("IS_USER");
    if (String(e).includes("jwt expired")) {
      return sendBadRequestWith406Code(res, messages.tokenExpiredError);
    } else if (String(e).includes("invalid token")) {
      return sendBadRequestWith406Code(res, messages.invalidToken);
    } else if (String(e).includes("jwt malformed")) {
      return sendBadRequestWith406Code(res, messages.invalidToken);
    }
    logger.error(e);
    return sendBadRequest(res, messages.somethingGoneWrong);
  }
};
