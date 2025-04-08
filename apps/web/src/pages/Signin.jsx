import React, { useState } from "react";
import { signin, socialLogin } from "../api/auth";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure, loginStart } from "../features/auth/slice";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // New state for handling loading

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submissions

    dispatch(loginStart());
    setLoading(true);

    try {
      const data = await signin(formData);
      dispatch(loginSuccess(data));
      toast.success("Signin successful!");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      dispatch(loginFailure(error.response?.data?.message || "Signin failed!"));
      toast.error(error.response?.data?.message || "Signin failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Sign In
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
          disabled={loading} // Disable button when loading
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <Divider sx={{ my: 3 }}>OR</Divider>

      <Box display="flex" flexDirection="column" gap={1.5}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#db4437", color: "#fff" }}
          onClick={() => socialLogin("google")}
          // disabled={loading}
        >
          Sign in with Google
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#000", color: "#fff" }}
          onClick={() => socialLogin("github")}
          // disabled={loading}
        >
          Sign in with GitHub
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1877F2", color: "#fff" }}
          onClick={() => socialLogin("facebook")}
          // disabled={loading}
        >
          Sign in with Facebook
        </Button>
     
      </Box>
      <Typography align="center" sx={{ mt: 3 }}>
        Don't have an account?{" "}
        <Button
          onClick={() => navigate("/signup")}
          sx={{ textTransform: "none" }}
        >
          Sign Up
        </Button>
      </Typography>
    </Container>
  );
};

export default Signin;
