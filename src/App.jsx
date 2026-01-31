import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Admin = lazy(() => import('./pages/Admin'))
const Booking = lazy(() => import('./pages/Booking'))

// Loading component with inline styles (guaranteed to show)
const Loading = () => (
  <div style={{
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#d4af37',
    fontFamily: 'sans-serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(212, 175, 55, 0.3)',
        borderTop: '3px solid #d4af37',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <p>...טוען</p>
    </div>
  </div>
)

function App() {
  console.log('🎨 App component rendering...')

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </Suspense>
  )
}

export default App
