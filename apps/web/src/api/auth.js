import API from "./axios.js";

export const loginApi = async (data) => {
  const response = await API.post("/user/login", data);
  return response.data;
};

export const signupApi = async (data) => {
  const response = await API.post("/user/registration", data);
  return response.data;
};
