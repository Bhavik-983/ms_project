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
  cloudinary,
  deleteFromCloudinary,
  UserModel,
  FollowerModel,
  imageUploader,
  axios,
} from "@myorg/common";

// {
//   "watch": ["src/", "../../packages/common/src/"],
//   "ext": "js,json",
//   "ignore": ["node_modules/"],
//   "exec": "node src/bin/www.js"
// }

export const googleAuth = async (req, res) => {
  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        redirect_uri: config.REDIRECT_URI,
        grant_type: "authorization_code",
      }
    );

    const { access_token, id_token } = tokenResponse.data;

    // Step 3: Fetch user details from Google
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const user = userInfoResponse.data;
    console.log(user);
    return sendSuccess(res, messages.registrationSuccess);

    // let user = await UserModel.findOne({ email: data.email });

    // if (!user) {
    //   user = new UserModel({
    //     name: data.name,
    //     email: data.email,
    //     profile_image: data.picture,
    //   });
    //   await user.save();
    // }
  } catch (e) {
    return sendBadRequest(res, errorHelper(res, "GOOGLE_AUTHENTICATION"));
  }
};

export const registration = async (req, res) => {
  try {
    const data = req.body;

    const isEmail = await UserModel.findOne({ email: data.email });
    if (isEmail) return sendBadRequest(res, messages.emailAlreadyExists);

    const newUser = await new UserModel({
      ...data,
      set_password_token: crypto.randomBytes(30).toString("hex"),
      set_password_token_exp_time: new Date(
        new Date().getTime() + 60 * 1440 * 1000
      ),
      isNewUser: true,
    }).save();
    await sendTextMail(
      [data?.email],
      config.SG_MAIL,
      "Set password",
      `url:http://localhost:5173/set/password/${newUser.set_password_token}`
    );

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
    return sendSuccess(
      res,
      {
        accessToken,
        refreshToken,
      },
      messages.loginSuccess
    );
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

    console.log("tokkkenenne", data);

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
    if (req.file) {
      const result = await imageUploader(
        req.file.path,
        "user_profile/" + user._id.toString().slice(-5)
      );
      user.profile_image.url = result.secure_url;
      user.profile_image.public_id = result.public_id;
    }
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

export const updateProfile = async (req, res) => {
  try {
    const data = req?.body;
    const user = await UserModel.findOne({ _id: req?.user?._id });
    if (!user) return sendBadRequest(res, messages?.userNotFound);

    user.name = data?.name;
    if (req.file) {
      if (req.user.profile_image.public_id)
        await deleteFromCloudinary(req.user.profile_image.public_id);
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `instaclone/user_profile/${user._id.toString().slice(-5)}`, // Optional folder in Cloudinary
      });
      user.profile_image.url = result.secure_url;
      user.profile_image.public_id = result.public_id;
    }

    await user.save();
    return sendSuccess(res, messages.profileUpdateSuccessfully);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "UPDATE_PROFILE"));
  }
};

export const followUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.userId });
    if (!user) return sendBadRequest(res, messages.userNotFound);

    if (req.user._id.equals(req.params.userId))
      return sendBadRequest(res, messages.youCanNotSelfFollow);

    const follower = await FollowerModel.findOne({
      fk_user_id: req.params.userId,
      fk_followers_id: req.user._id,
    });
    if (!follower) {
      await new FollowerModel({
        fk_user_id: req.params.userId,
        fk_followers_id: req.user._id,
        status: "REQUESTED",
      }).save();
    }
    return sendSuccess(res, messages.followUserSuccessfully);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "FOLLOW_USER"));
  }
};

export const unFollowUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.userId });
    if (!user) return sendBadRequest(res, messages.userNotFound);

    // await FollowerModel.deleteOne({
    //   user: req.user._id,
    //   following: req.params.userId,
    // });
    await FollowerModel.deleteOne({
      fk_user_id: req.params.userId,
      fk_followers_id: req.user._id,
      status: "ACCEPTED",
    });

    return sendSuccess(res, messages.unfollowSuccessfully);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "UNFOLLOW_USER"));
  }
};

export const acceptOrRejectFollowers = async (req, res) => {
  try {
    const data = req.body;
    const user = await UserModel.findOne({ _id: req.params.userId });
    if (!user) return sendBadRequest(res, messages.userNotFound);

    const request = await FollowerModel.findOne({
      fk_user_id: req.user._id,
      fk_followers_id: req.params.userId,
      status: "REQUESTED",
    });

    if (request) {
      if (data.status === "ACCEPTED") {
        await FollowerModel.updateOne(
          { fk_user_id: req.user._id, fk_followers_id: req.params.userId },
          { $set: { status: "ACCEPTED" } }
        );
        // await FollowerModel.updateOne(
        //   { user: req.params.userId, following: req.user._id }, // filter by current user
        //   { $set: { following: req.user._id } }, // add to array if not present
        //   { upsert: true } // create if it doesn't exist
        // );
      } else {
        await FollowerModel.deleteOne({
          fk_user_id: req.user._id,
          fk_followers_id: req.params.userId,
          status: "REQUESTED",
        });
      }
    }
    return sendSuccess(
      res,
      data.status === "ACCEPTED"
        ? messages.requestAccepted
        : messages.requestRejected
    );
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "UPDATE_FOLLOW_REQUEST"));
  }
};

export const userFollowList = async (req, res) => {
  try {
    const data = req.query;
    let userData;
    if (data.type === "REQUESTED") {
      userData = await FollowerModel.find({
        fk_followers_id: req.user._id,
        status: "REQUESTED",
      });
    }

    if (data.type === "ACCEPTED") {
      userData = await FollowerModel.find({
        fk_user_id: req.user._id,
        status: "ACCEPTED",
      });
    }

    if (data.type === "FOLLOWING") {
      userData = await FollowerModel.find({
        fk_followers_id: req.user._id,
      });
    }
    return sendSuccess(res, userData, messages.listGetSuccessfully);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "USER_FOLLOW_LIST"));
  }
};
