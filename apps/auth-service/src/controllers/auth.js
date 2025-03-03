import { UserModel } from "../models/auth.js";
import {
  sendBadRequest,
  sendSuccess,
  errorHelper,
  messages,
  bcrypt,
  generateAccessToken,
  tokenId,
  generateRefreshToken,
  config,
  crypto,
  sendBadRequestWith401Code,
  sendTextMail,
  sendBadRequestWith406Code,
} from "@myorg/common";

export const registration = async (req, res) => {
  try {
    const data = req.body;

    const isEmail = await UserModel.findOne({ email: data.email });
    if (isEmail) return sendBadRequest(res, messages.emailAlreadyExists);

    await new UserModel({
      ...data,
      set_password_token: crypto.randomBytes(30).toString("hex"),
      set_password_token_exp_time: new Date(
        new Date().getTime() + 60 * 1440 * 1000
      ),
      isNewUser: true,
    }).save();

    return sendSuccess(res, messages.registrationSuccess);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "REGISTRATION"));
  }
};

export const login = async (req, res) => {
  try {
    const data = req.body;

    const user = await UserModel.findOne({ email: data.email });
    if (!user) return sendBadRequest(res, messages.emailNotFound);

    if (!user.password) return sendBadRequest(res, messages.passwordNotExists);

    const isMatch = await bcrypt.compare(data?.password, user?.password);
    if (!isMatch) return sendBadRequest(res, messages.invalidPassword);

    const accessTokenId = tokenId();
    const refreshTokenId = tokenId();
    const accessToken = await generateAccessToken({
      _id: user._id,
      accessTokenId,
    });
    const refreshToken = await generateRefreshToken({
      _id: user._id,
      refreshTokenId,
    });
    user.access_token_id = accessTokenId;
    user.refresh_token_id = refreshTokenId;
    await user.save();
    return sendSuccess(res, messages.loginSuccess, {
      accessToken,
      refreshToken,
    });
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "LOGIN"));
  }
};

export const generateNewAccessAndRefreshToken = async (req, res) => {
  try {
    const token = req.body.refresh_token;
    Jwt.verify(token, config?.USER_REFRESH_SECRET, async (err, decoder) => {
      if (err) return sendBadRequestWith406Code(res, messages?.invalidToken);

      const data = await UserModel.findOne({ _id: decoder?.id });
      if (!data) return sendBadRequest(res, messages?.userNotFound);
      if (data?.refresh_token_id !== decoder?.refreshTokenId)
        return sendBadRequest(res, messages?.invalidToken);

      const refreshTokenId = tokenId();
      const accessTokenId = tokenId();

      const accessToken = generateAccessToken({ _id: data._id, accessTokenId });
      const refreshToken = generateRefreshToken({
        _id: data._id,
        refreshTokenId,
      });

      data.access_token_id = accessTokenId;
      data.refresh_token_id = refreshTokenId;
      await data.save();
      return sendSuccess(
        res,
        { access_token: accessToken, refresh_token: refreshToken },
        messages?.TokenGenerateSuccessfully
      );
    });
  } catch (e) {
    return sendBadRequest(
      res,
      errorHelper(e, "GENERATE_NEW_ACCESS_AND_REFRESH_TOKEN")
    );
  }
};

export const setPassword = async (req, res) => {
  try {
    const data = req?.body;

    const user = await UserModel.findOne({ set_password_token: data?.token });
    if (!user) return sendBadRequest(res, messages?.tokenNotExist);

    const currentTime = Date.now();
    if (!(currentTime < user.set_password_token_exp_time))
      return sendBadRequestWith401Code(res, messages.tokenExpiredError);

    if (user && user.password) {
      user.password = await bcrypt.hashSync(data.password, 10);
      await user.save();
      await UserModel.update(
        {
          _id: user._id,
        },
        {
          $unset: {
            set_password_token: "",
            set_password_token_exp_time: "",
          },
        }
      );

      return sendSuccess(res, messages.passwordResetSuccessfully);
    }

    user.name = data.name;
    // if (req.file) user.profile_image = config.IMAGE_PATH + req.file.filename;
    user.password = await bcrypt.hashSync(data?.password, 10);
    user.set_password_token = undefined;
    user.set_password_token_exp_time = undefined;
    user.isNewUser = false;
    await user.save();
    return sendSuccess(res, messages?.passwordSetSuccessfully);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "SET_PASSWORD"));
  }
};

export const changePassword = async (req, res) => {
  try {
    const data = req?.body;
    const user = await UserModel.findOne({ _id: req?.user?._id });
    if (!user) return sendBadRequest(res, messages?.userNotFound);

    // match password
    const matchPassword = await bcrypt.compare(data?.password, user?.password);
    if (!matchPassword) return sendBadRequest(res, messages?.invalidPassword);

    // match old and new password
    const matchOldAndNewPaswd = await bcrypt.compare(
      data?.new_password,
      user?.password
    );
    if (matchOldAndNewPaswd)
      return sendBadRequest(res, messages?.selectDifferentPassword);

    const hashNewPassword = await bcrypt.hashSync(data?.new_password, 10);

    user.password = hashNewPassword;
    await user.save();
    return sendSuccess(res, adminData, messages?.passwordResetSuccessfully);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "RESET_PASSWORD"));
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const data = req?.body;
    const user = await UserModel.findOne({ email: data?.email });
    if (!user) return sendBadRequest(res, messages?.userNotFound);

    const cryptoToken = crypto.randomBytes(30);
    user.set_password_token = cryptoToken.toString("hex");
    user.set_password_token_exp_time = new Date(
      new Date().getTime() + 60 * 1440 * 1000
    );

    await user.save();
    if (user.isNewUser === true) {
      await sendTextMail(
        [data?.email],
        config.SG_MAIL,
        "Set password",
        `url: http:192.168.29.5:5000/set-password/${user.set_password_token}`
      );
    } else {
      await sendTextMail(
        [data?.email],
        config.SG_MAIL,
        "Set password",
        `url: http:192.168.29.5:5000/reset-password/${user.set_password_token}`
      );
    }

    return sendSuccess(res, messages.linkSendSuccessfully);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "LINK_SEND_SUCCESSFULLY"));
  }
};

export const verifyToken = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      set_password_token: req.params.token,
    });
    if (!user) return sendBadRequest(res, messages.tokenNotExist);

    if (user.set_password_token_exp_time < Date.now())
      return sendBadRequest(res, messages.tokenExpiredError);

    return sendSuccess(res, messages.tokenVerifySuccessfully);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "TOKEN_VERIFY"));
  }
};
