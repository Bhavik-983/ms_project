import API from "./axios.js";

export const loginApi = async (data) => {
  const response = await API.post("/user/login", data);
  return response.data;
};

export const signupApi = async (data) => {
  const response = await API.post("/user/registration", data);
  return response.data;
};

export const setPasswordApi = async ({ token, password }) => {
  const response = await API.post("/user/set/password", {
    token,
    password,
  });
  return response.data;
};

export const socialLogin = (provider) => {
  window.location.href = `${API}/social/${provider}`;
};

export const handleSocialLoginResponse = async (token) => {
  const response = await API.post(`${API_URL}/social/callback`, { token });
  return response.data;
};

