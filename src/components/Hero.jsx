import { Link } from 'react-router-dom'
import { FaInstagram, FaCalendarAlt } from 'react-icons/fa'
import useStore from '../store/useStore'

const Hero = () => {
  const { siteContent } = useStore()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
        <div className="absolute inset-0 opacity-3">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.5'%3E%3Cpath d='M30 28v-3h-2v3h-3v2h3v3h2v-3h3v-2h-3zm0-25V0h-2v3h-3v2h3v3h2V5h3V3h-3zM5 28v-3H3v3H0v2h3v3h2v-3h3v-2H5zM5 3V0H3v3H0v2h3v3h2V5h3V3H5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '50px 50px'
            }}
          />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-10 w-48 h-48 bg-[#d4af37]/3 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-10 w-72 h-72 bg-[#d4af37]/3 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center pt-14">
        {/* Brand Name */}
        <div className="mb-6 fade-in">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-[#d4af37]">Rak</span>
            <span className="text-white">.</span>
            <span className="text-white">Eden</span>
          </h1>
        </div>

        <h2 className="text-lg md:text-xl text-gray-400 mb-3 fade-in" style={{ animationDelay: '0.2s' }}>
          {siteContent.heroSubtitle}
        </h2>

        <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto mb-10 fade-in leading-relaxed" style={{ animationDelay: '0.4s' }}>
          {siteContent.heroDescription}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 fade-in" style={{ animationDelay: '0.6s' }}>
          {/* Book Now Button - Links to /booking */}
          <Link
            to="/booking"
            className="btn-primary flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 rounded-md font-semibold text-sm hover:bg-[#f4d03f]"
          >
            <FaCalendarAlt size={14} />
            קבע תור עכשיו
          </Link>

          {/* Instagram Button */}
          <a
            href={siteContent.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-transparent border border-[#d4af37]/60 text-[#d4af37] px-6 py-3 rounded-md font-semibold text-sm transition-all hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37]"
          >
            <FaInstagram size={16} />
            עקבו באינסטגרם
          </a>
        </div>
      </div>

      {/* Removed scroll indicator for cleaner app-like feel */}
    </section>
  )
}

export default Hero
