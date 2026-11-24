import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './authConfig.js'
import AuthProvider from './context/AuthContext'
import './index.css'
import App from './App.jsx'
import theme from './theme'

export const msalInstance = new PublicClientApplication(msalConfig)

// ¡EL TRUCO ESTÁ AQUÍ! Inicializar MSAL antes de que React dibuje la pantalla
msalInstance.initialize().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </MsalProvider>
    </StrictMode>,
  )
});