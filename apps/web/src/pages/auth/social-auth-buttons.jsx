import { Button, Stack } from '@mui/material';
import { Google, Facebook, GitHub } from '@mui/icons-material';
import { socialLogin } from '../../api/auth';

const SocialAuthButtons = () => {
  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Button variant="outlined" startIcon={<Google />} onClick={() => socialLogin('google')}>
        Sign in with Google
      </Button>
      <Button variant="outlined" startIcon={<Facebook />} onClick={() => socialLogin('facebook')}>
        Sign in with Facebook   
      </Button>
      <Button variant="outlined" startIcon={<GitHub />} onClick={() => socialLogin('github')}>
        Sign in with GitHub
      </Button>
    </Stack>
  );
};

export default SocialAuthButtons;
