import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from "./theme";

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
     <ToastContainer position="top-center" autoClose={2000} />
    </ThemeProvider>
  </StrictMode>,
)
