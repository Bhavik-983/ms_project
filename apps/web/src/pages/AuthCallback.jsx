// components/AuthCallback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import axios from 'axios';
import { CircularProgress, Box, Typography, Alert } from '@mui/material';
import { loginSuccess } from '../features/auth/slice';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL query params
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        
        if (!code) {
          throw new Error('Authorization code not provided in callback');
        }
        
        // Send the code to your backend
        const response = await axios.get(`http://localhost:8000/user/google/redirect?code=${code}`);
        console.log(response,"dsfsasafdf");
        
        // Backend returns JSON with tokens
        if (response.data.success) {
          const { accessToken, refreshToken } = response.data.data;
          
          // Store tokens in localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          // Update Redux state with user information if available
          if (response.data.data.user) {
            dispatch(loginSuccess(response.data.data.user));
          }
          
          // Navigate to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          throw new Error(response.data.message || 'Authentication failed');
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        setError(error.response?.data?.message || error.message || 'Authentication failed');
        
        // Clear any tokens that might have been set
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Show error for a moment before redirecting
        setTimeout(() => {
          navigate('/login', { 
            state: { error: error.response?.data?.message || error.message || 'Authentication failed' },
            replace: true 
          });
        }, 3000);
      }
    };
    
    handleCallback();
  }, [dispatch, location, navigate]);
  
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Completing authentication...
          </Typography>
        </>
      )}
    </Box>
  );
};

export default AuthCallback;