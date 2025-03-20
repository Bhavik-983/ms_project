import { useState } from 'react';
import { useMutation } from 'react-query';
import { loginApi } from '../../api/auth';
import { useDispatch } from 'react-redux';
import { Button, TextField, Box, Typography } from '@mui/material';
import { setUser } from '@web/common';
const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const mutation = useMutation(loginApi, {
    onSuccess: (data) => {
      dispatch(setUser(data.user));
      localStorage.setItem('token', data.token);
      alert('Login Successful');
    },
    onError: (error) => {
      alert(error.response.data.message || 'Login Failed');
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" textAlign="center">Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          {mutation.isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Box>
  );
};

export default Login;
