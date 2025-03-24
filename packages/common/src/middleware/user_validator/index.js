import jwt from "jsonwebtoken";
import {
  sendBadRequest,
  sendBadRequestWith406Code,
} from "../../utilities/response/index.js";
import messages from "../../utilities/messages.js";
import config from "../../config/index.js";
import logger from "../../utilities/logger.js";
import { UserModel } from "../../database/index.js";
import { validateAccessToken } from "../../helper/accessTokenHelper.js";
import { errorHelper } from "../../../dist/index.js";
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

export const isValidUser = async (socket, next) => {
  try {
    if (socket.handshake.auth.authorization) {
      if (!(socket.handshake.auth && socket.handshake.auth.authorization))
        return next(new Error("Authentication error")); // Auth token required
      let tokenInfo;
      const tokenInformation = await validateAccessToken(
        socket.handshake.auth.authorization
      );
      if (tokenInformation) tokenInfo = tokenInformation;
      if (!(tokenInfo && tokenInfo._id))
        return next(new Error(messages.tokenFormatInvalid)); // Validate token
      socket.userId = tokenInfo._id;
      next();
    }
    if (socket.handshake.headers.authorization) {
      if (!(socket.handshake.headers && socket.handshake.headers.authorization))
        return next(new Error("Authentication error")); // Auth token required

      let tokenInfo;
      const tokenInformation = await validateAccessToken(
        socket.handshake.headers.authorization
      );
      if (tokenInformation) tokenInfo = tokenInformation;
      if (!(tokenInfo && tokenInfo._id))
        return next(new Error(messages.tokenFormatInvalid)); // Validate token
      socket.userId = tokenInfo._id;
      next();
    }
  } catch (e) {
    if (String(e).includes("jwt expired")) {
      return next(new Error(messages.tokenExpiredError));
    } else if (String(e).includes("invalid token")) {
      return next(new Error(messages.invalidToken));
    } else if (String(e).includes("jwt malformed")) {
      return next(new Error(messages.invalidToken));
    }
    logger.error("IS_ADMINISTER_FOR_SOCKET");
    logger.error(e);
    next(new Error("Authentication error"));
  }
};

export const redirectGoogleAuthConsent = (req, res, next) => {
  try {
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${config.CLIENT_ID}&redirect_uri=${config.REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;
    res.redirect(authUrl);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "REDIRECT_GOOGLE_CONSENT"));
  }
};
