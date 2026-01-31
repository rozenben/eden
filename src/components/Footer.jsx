import { FaInstagram, FaWhatsapp, FaHeart } from 'react-icons/fa'
import useStore from '../store/useStore'

const Footer = () => {
  const { siteContent } = useStore()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#d4af37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Logo */}
          <div className="text-center md:text-right">
            <h3 className="text-2xl font-bold text-[#d4af37] mb-2">INK STUDIO</h3>
            <p className="text-gray-500 text-sm">אומנות על העור</p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            <a
              href={siteContent.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-[#d4af37] hover:text-black transition-all text-[#d4af37]"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href={`https://wa.me/${siteContent.contactPhone?.replace(/-/g, '').replace(/^0/, '972')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-[#d4af37] hover:text-black transition-all text-[#d4af37]"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={20} />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm flex items-center justify-center md:justify-start gap-1">
              © {currentYear} INK STUDIO. כל הזכויות שמורות.
            </p>
            <p className="text-gray-600 text-xs mt-1 flex items-center justify-center md:justify-start gap-1">
              נבנה עם <FaHeart className="text-[#d4af37]" size={10} />
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
