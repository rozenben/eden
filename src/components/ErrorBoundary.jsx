import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0a0a0a',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'sans-serif'
        }}>
          <h1 style={{ color: '#d4af37', marginBottom: '20px' }}>שגיאה בטעינת האתר</h1>
          <p style={{ marginBottom: '10px' }}>Something went wrong. Error details:</p>
          <pre style={{
            backgroundColor: '#1a1a1a',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '90%',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#d4af37',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            טען מחדש
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
