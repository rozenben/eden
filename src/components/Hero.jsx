import { Link } from 'react-router-dom'
import { FaInstagram, FaCalendarAlt } from 'react-icons/fa'
import useStore from '../store/useStore'

const Hero = () => {
  const { siteContent } = useStore()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-10 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 fade-in">
          <span className="text-white">{siteContent.heroTitle?.split(' ')[0]} </span>
          <span className="text-[#d4af37]">{siteContent.heroTitle?.split(' ').slice(1).join(' ')}</span>
        </h1>

        <h2 className="text-xl md:text-2xl text-gray-400 mb-4 fade-in" style={{ animationDelay: '0.2s' }}>
          {siteContent.heroSubtitle}
        </h2>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12 fade-in" style={{ animationDelay: '0.4s' }}>
          {siteContent.heroDescription}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in" style={{ animationDelay: '0.6s' }}>
          {/* Book Now Button - Links to /booking */}
          <Link
            to="/booking"
            className="btn-primary flex items-center gap-3 bg-[#d4af37] text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#f4d03f]"
          >
            <FaCalendarAlt />
            קבע תור עכשיו
          </Link>

          {/* Instagram Button */}
          <a
            href={siteContent.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-transparent border-2 border-[#d4af37] text-[#d4af37] px-8 py-4 rounded-lg font-bold text-lg transition-all hover:bg-[#d4af37] hover:text-black"
          >
            <FaInstagram size={24} />
            עקבו אחרינו באינסטגרם
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 fade-in" style={{ animationDelay: '1s' }}>
          <div className="w-6 h-10 border-2 border-[#d4af37]/50 rounded-full flex justify-center p-2">
            <div className="w-1.5 h-3 bg-[#d4af37] rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
