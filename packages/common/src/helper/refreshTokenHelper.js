import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const generateRefreshToken = (data) => {
  return jwt.sign(data, config.USER_REFRESH_SECRET, { expiresIn: "1d" });
};

export const validateRefreshToken = async (token, role) => {
  try {
    const tokenInfo = await jwt.verify(token, config[`${role}_REFRESH_SECRET`]);
    return tokenInfo;
  } catch (e) {
    return null;
  }
};
