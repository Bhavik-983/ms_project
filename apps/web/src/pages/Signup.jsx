import React, { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      toast.success("Signup successful! Please login.");
      navigate("/signin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center">
        Signup
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          onChange={handleChange}
          required
        />
        <Button fullWidth variant="contained" color="primary" type="submit">
          Signup
        </Button>
      </form>
      <Typography align="center" sx={{ marginTop: 2 }}>
        OR
      </Typography>

      <Button
        fullWidth
        variant="contained"
        sx={{ backgroundColor: "#db4437", color: "#fff", marginTop: 2 }}
        onClick={() => socialLogin("google")}
      >
        Sign in with Google
      </Button>
      <Button
        fullWidth
        variant="contained"
        sx={{ backgroundColor: "#000", color: "#fff", marginTop: 2 }}
        onClick={() => socialLogin("github")}
      >
        Sign in with GitHub
      </Button>
      <Button
        fullWidth
        variant="contained"
        sx={{ backgroundColor: "#1877F2", color: "#fff", marginTop: 2 }}
        onClick={() => socialLogin("facebook")}
      >
        Sign in with Facebook
      </Button>
    </Container>
  );
};

export default Signup;
