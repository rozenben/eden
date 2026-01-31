import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import useStore from '../store/useStore'

const Contact = () => {
  const { siteContent } = useStore()

  const contactInfo = [
    {
      icon: FaPhone,
      label: 'טלפון',
      value: siteContent.contactPhone,
      href: `tel:${siteContent.contactPhone?.replace(/-/g, '')}`
    },
    {
      icon: FaEnvelope,
      label: 'אימייל',
      value: siteContent.contactEmail,
      href: `mailto:${siteContent.contactEmail}`
    },
    {
      icon: FaMapMarkerAlt,
      label: 'כתובת',
      value: siteContent.contactAddress,
      href: `https://maps.google.com/?q=${encodeURIComponent(siteContent.contactAddress || '')}`
    },
    {
      icon: FaClock,
      label: 'שעות פעילות',
      value: siteContent.workingHours,
      href: null
    }
  ]

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-[#d4af37]">צרו</span> קשר
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            רוצים לקבוע פגישת ייעוץ? צרו איתנו קשר ונחזור אליכם בהקדם.
          </p>
          <div className="w-24 h-1 bg-[#d4af37] mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {contactInfo.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#d4af37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-[#d4af37]" size={20} />
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">{item.label}</h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('https') ? '_blank' : undefined}
                      rel={item.href.startsWith('https') ? 'noopener noreferrer' : undefined}
                      className="text-white text-lg hover:text-[#d4af37] transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-white text-lg">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="pt-8 border-t border-[#d4af37]/20">
              <h3 className="text-gray-400 text-sm mb-4">עקבו אחרינו</h3>
              <div className="flex gap-4">
                <a
                  href={siteContent.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[#d4af37]/10 rounded-lg flex items-center justify-center hover:bg-[#d4af37] hover:text-black transition-all text-[#d4af37]"
                  aria-label="Instagram"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href={`https://wa.me/${siteContent.contactPhone?.replace(/-/g, '').replace(/^0/, '972')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[#d4af37]/10 rounded-lg flex items-center justify-center hover:bg-[#d4af37] hover:text-black transition-all text-[#d4af37]"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Map Placeholder / CTA */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#d4af37]/20">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaMapMarkerAlt className="text-[#d4af37]" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">בואו לבקר אותנו</h3>
              <p className="text-gray-400 mb-6">
                הסטודיו שלנו ממוקם בלב תל אביב, במיקום נוח ונגיש.
              </p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(siteContent.contactAddress || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#d4af37] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#f4d03f] transition-colors"
              >
                פתח במפות
              </a>
            </div>

            {/* Studio Image Placeholder */}
            <div className="mt-8 aspect-video bg-[#2a2a2a] rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                <span className="text-sm">מיקום הסטודיו</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
