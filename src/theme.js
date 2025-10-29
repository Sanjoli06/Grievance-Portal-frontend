import { createTheme, responsiveFontSizes } from "@mui/material";

let theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0052cc" },
    secondary: { main: "#36b37e" },
    background: { default: "#f4f6f8", paper: "#ffffff" },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});
theme = responsiveFontSizes(theme);

export default theme;
