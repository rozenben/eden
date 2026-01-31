import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import App from './App.jsx'

// Debug log
console.log('🚀 App starting...', {
  base: '/eden/',
  env: import.meta.env.MODE,
  hasFirebaseKey: Boolean(import.meta.env.VITE_FIREBASE_API_KEY)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename="/eden">
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
