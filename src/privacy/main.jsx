import React from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/fonts.js'
import '../styles/tokens.css'
import '../styles/global.css'
import { PrivacyProvider } from '../lgpd/PrivacyProvider.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import PrivacyPage from './PrivacyPage.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrivacyProvider>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header base="/" />
      <PrivacyPage />
      <Footer base="/" />
    </PrivacyProvider>
  </React.StrictMode>,
)
