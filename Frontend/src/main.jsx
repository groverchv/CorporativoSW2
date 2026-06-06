import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/richtext.css'
import App from './App.jsx'

// El Service Worker se registra automáticamente a través del plugin vite-plugin-pwa
// La configuración está en vite.config.js con registerType: 'autoUpdate'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
