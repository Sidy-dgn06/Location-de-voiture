// src/main.tsx
// Personne 4 — feature/components-routing
// Point d'entrée principal de l'application React

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)