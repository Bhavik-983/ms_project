import { useState } from 'react';
import { useMutation } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { setPasswordApi } from '../../api/auth';
const SetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const mutation = useMutation(setPasswordApi, {
    onSuccess: () => {
      alert('Password set successfully!');
      navigate('/login'); // Redirect to login
    },
    onError: (error) => {
      console.error('Error setting password:', error);
      alert('Failed to set password');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    mutation.mutate({ token, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password"
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        required
      />
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Setting Password...' : 'Set Password'}
      </button>
    </form>
  );
};

export default SetPassword;
