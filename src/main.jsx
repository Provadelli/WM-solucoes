import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/fonts.js'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.jsx'
import { PrivacyProvider } from './lgpd/PrivacyProvider.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrivacyProvider>
      <App />
    </PrivacyProvider>
  </React.StrictMode>,
)
