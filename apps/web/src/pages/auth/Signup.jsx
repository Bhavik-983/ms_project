import { useState } from 'react';
import { useMutation } from 'react-query';
import { signupApi } from '../../api/auth';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { OAuthButton } from '@web/common';
const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const mutation = useMutation(signupApi, {
    onSuccess: () => {
      alert('Signup successful');
    },
    onError: (error) => {
      alert(error.response.data.message || 'Signup Failed');
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
      <Typography variant="h5" textAlign="center">Signup</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" />
        {/* <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} margin="normal" /> */}
        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
          {mutation.isLoading ? 'Signing up...' : 'Signup'}
        </Button>
        <OAuthButton />
      </form>
    </Box>
  );
};

export default Signup;
