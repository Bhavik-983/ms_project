import axios from 'axios';
import { UserModel } from '../database/models/auth.js';
import { generateAccessToken, tokenId } from './accessTokenHelper.js';
import { generateRefreshToken } from './refreshTokenHelper.js';
import messages from '../utilities/messages.js';
import { imageUploader } from '../utilities/upload.js';

async function socialGoogleAuth(data) {
    const response = await axios.post(
        data.tkn_res_uri
        ,
        {
            code: data.code,
            client_id: data.client_id,
            client_secret: data.client_secret,
            redirect_uri: data.redirect_uri,
            grant_type: data.grant_type,
        }
    );
    const { access_token } = response.data;

    // Step 3: Fetch user details from Google
    const user = await axios.get(
        data.user_info_uri,
        {
            headers: { Authorization: `Bearer ${access_token}` },
        }
    );
  
    return user.data
}

async function socialGithubAuth(data) {
    const response = await axios.post(data.tkn_res_uri, null, {
        params: {
          client_id: data.client_id,
          client_secret: data.client_secret,
          code:data.code,
        },
        headers: { Accept: "application/json" },
      });
    const { access_token } = response.data;

    // Step 3: Fetch user details from Github
    const user = await axios.get(
        data.user_info_uri,
        {
            headers: { Authorization: `Bearer ${access_token}` },
        }
    );

    const email = await axios.get(
        data.user_email_uri,
        {
            headers: { Authorization: `Bearer ${access_token}` },
        }
    );
    const primaryEmail = email.data.find(email => email.primary && email.verified)?.email || null;

    return {user:user.data,primaryEmail}
}

async function socialFacebookAuth(data) {
    const response = await axios.post(data.tkn_res_uri, null, {
        params: {
          client_id: data.client_id,
          client_secret: data.client_secret,
          redirect_uri: data.redirect_uri,
          code:data.code,
        },
        headers: { Accept: "application/json" },
      });
    const { access_token } = response.data;

      // Get user data from Facebook
      const user = await axios.get(data.user_info_uri, {
        params: { fields: "id,name,email,picture", access_token: access_token },
      });


    return user.data
}

async function verifyUser(user) {
    const isUser = await UserModel.findOne({
        $or: [
            { social_auth_id: user.uid },  // Check by Google ID (sub)
            { email: user.email }      // Check by Email
        ]
    });
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

    if (!isUser) {
        const newUser = new UserModel({
            name: user.name,
            email: user.email,
            social_auth_id: user.uid,
            isNewUser: false
        })
        const result = await imageUploader(
            user.picture,
            "user_profile/" + newUser._id.toString().slice(-5)
        );
        newUser.profile_image.url = result.secure_url;
        newUser.profile_image.public_id = result.public_id;
        newUser.access_token_id = accessTokenId
        newUser.refresh_token_id = refreshTokenId
        await newUser.save()

        return { accessToken, refreshToken, message: messages.registrationSuccess };
    }
    isUser.access_token_id = accessTokenId
    isUser.refresh_token_id = refreshTokenId
    await isUser.save();

    return { accessToken, refreshToken, message: messages.loginSuccess }
}


export { socialGoogleAuth,socialGithubAuth,socialFacebookAuth ,verifyUser }

