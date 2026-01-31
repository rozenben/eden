import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaCalendarAlt } from 'react-icons/fa'

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
    <nav className="fixed top-0 right-0 left-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#d4af37]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Right: Logo */}
          <Link
            to="/"
            className="text-xl font-bold tracking-wider"
          >
            <span className="text-[#d4af37]">Rak</span>
            <span className="text-white">.</span>
            <span className="text-white">Eden</span>
          </Link>

          {/* Center: Book Now Button (Desktop) */}
          <div className="hidden md:flex items-center">
            <Link
              to="/booking"
              className="btn-primary flex items-center gap-2 bg-[#d4af37] text-black px-5 py-2 rounded-md font-medium text-sm hover:bg-[#f4d03f]"
            >
              <FaCalendarAlt size={12} />
              קביעת תור
            </Link>
          </div>

          {/* Left: Desktop Navigation & Menu */}
          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`text-xs font-medium transition-colors hover:text-[#d4af37] ${
                    isActive(link.path) ? 'text-[#d4af37]' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/admin"
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
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
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-[#d4af37]/10">
            <div className="flex flex-col gap-3">
              {/* Mobile Book Now Button */}
              <Link
                to="/booking"
                onClick={() => setIsOpen(false)}
                className="btn-primary flex items-center justify-center gap-2 bg-[#d4af37] text-black px-5 py-2.5 rounded-md font-medium text-sm hover:bg-[#f4d03f] mb-2"
              >
                <FaCalendarAlt size={12} />
                קביעת תור
              </Link>

              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`text-right text-sm font-medium transition-colors hover:text-[#d4af37] py-1 ${
                    isActive(link.path) ? 'text-[#d4af37]' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="text-right text-sm text-gray-500 hover:text-gray-300 transition-colors py-1"
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
