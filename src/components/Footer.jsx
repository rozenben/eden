import { FaInstagram, FaWhatsapp, FaHeart } from 'react-icons/fa'
import useStore from '../store/useStore'

const Footer = () => {
  const { siteContent } = useStore()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#d4af37]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-6 items-center">
          {/* Logo */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-bold mb-1">
              <span className="text-[#d4af37]">Rak</span>
              <span className="text-white">.</span>
              <span className="text-white">Eden</span>
            </h3>
            <p className="text-gray-500 text-xs">אומנות על העור</p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-3">
            <a
              href={siteContent.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-[#d4af37] hover:text-black transition-all text-[#d4af37]"
              aria-label="Instagram"
            >
              <FaInstagram size={14} />
            </a>
            <a
              href={`https://wa.me/${siteContent.contactPhone?.replace(/-/g, '').replace(/^0/, '972')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-[#d4af37] hover:text-black transition-all text-[#d4af37]"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={14} />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-xs flex items-center justify-center md:justify-start gap-1">
              © {currentYear} Rak.Eden. כל הזכויות שמורות.
            </p>
            <p className="text-gray-600 text-[10px] mt-1 flex items-center justify-center md:justify-start gap-1">
              נבנה עם <FaHeart className="text-[#d4af37]" size={8} />
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
