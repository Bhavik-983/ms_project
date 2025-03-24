import { Button } from "@mui/material";

const OAuthButton = () => (
  <>
    <Button href="http://localhost:8000/user/auth/google">
      Signup with Google
    </Button>
    <Button href="http://localhost:3005/api/auth/facebook">
      Signup with Facebook
    </Button>
    <Button href="http://localhost:3005/api/auth/github">
      Signup with GitHub
    </Button>
  </>
);

export default OAuthButton;
