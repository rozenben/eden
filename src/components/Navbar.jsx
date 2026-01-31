import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'בית' },
    { path: '/#gallery', label: 'גלריה' },
    { path: '/#contact', label: 'צור קשר' }
  ]

  const handleNavClick = (path) => {
    setIsOpen(false)
    if (path.includes('#')) {
      const element = document.getElementById(path.split('#')[1])
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#d4af37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-[#d4af37] tracking-wider"
          >
            INK STUDIO
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`text-sm font-medium transition-colors hover:text-[#d4af37] ${
                  isActive(link.path) ? 'text-[#d4af37]' : 'text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/admin"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              ניהול
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-[#d4af37]/20">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`text-right text-lg font-medium transition-colors hover:text-[#d4af37] ${
                    isActive(link.path) ? 'text-[#d4af37]' : 'text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="text-right text-lg text-gray-500 hover:text-gray-300 transition-colors"
              >
                ניהול
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
