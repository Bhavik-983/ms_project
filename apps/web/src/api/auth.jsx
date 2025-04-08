import axios from "axios";

const API_URL = "http://localhost:8000"; // Your Gateway URL

export const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/user/registration`, userData);
  return response.data;
};

export const signin = async (userData) => {
  const response = await axios.post(`${API_URL}/user/login`, userData);
  if (response.data.data.accessToken && response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
  } 
  return response.data;
};

export const socialLogin = (data) => {
  window.location.href = `http://localhost:8000/user/${data}/auth`;
};