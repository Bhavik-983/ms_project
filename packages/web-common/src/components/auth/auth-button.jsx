import { Button } from "@mui/material";

const OAuthButton = () => (
  <>
    <Button href="http://localhost:8000/user/auth">
      Signup with Google
    </Button>
    <Button href="http://localhost:8000/user/facebook/auth">
      Signup with Facebook
    </Button>
    <Button href="http://localhost:8000/user/github/auth">
      Signup with GitHub
    </Button>
  </>
);

export default OAuthButton;
