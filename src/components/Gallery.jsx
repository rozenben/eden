import { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import useStore from '../store/useStore'

const Gallery = () => {
  const { galleryItems, fetchGalleryItems, isLoading } = useStore()
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetchGalleryItems()
  }, [fetchGalleryItems])

  const openLightbox = (item) => {
    setSelectedImage(item)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
  }

  return (
    <section id="gallery" className="py-20 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-[#d4af37]">הגלריה</span> שלנו
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            מבחר מהעבודות האחרונות שלנו. כל קעקוע מעוצב בהתאמה אישית.
          </p>
          <div className="w-24 h-1 bg-[#d4af37] mx-auto mt-6" />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="spinner" />
          </div>
        )}

        {/* Gallery Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
              <div
                key={item.id}
                className="gallery-item relative group cursor-pointer rounded-lg overflow-hidden bg-[#1a1a1a]"
                onClick={() => openLightbox(item)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 right-0 left-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <span className="text-[#d4af37] text-sm">לחצו להגדלה</span>
                  </div>
                </div>

                {/* Gold Border on Hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#d4af37] transition-colors duration-300 rounded-lg pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && galleryItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">אין עבודות להצגה כרגע</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 left-6 text-white hover:text-[#d4af37] transition-colors z-10"
            onClick={closeLightbox}
            aria-label="סגור"
          >
            <FaTimes size={32} />
          </button>

          <div
            className="max-w-4xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 right-0 left-0 p-6 bg-gradient-to-t from-black/90 to-transparent rounded-b-lg">
              <h3 className="text-2xl font-bold text-white">
                {selectedImage.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Gallery
