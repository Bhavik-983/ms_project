import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme.js";

const MyThemeProvider = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MyThemeProvider;
