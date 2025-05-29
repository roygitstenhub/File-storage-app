import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId="882451240551-rk4edevg5of1a7qlddot3tcgrmiuuf47.apps.googleusercontent.com"
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
