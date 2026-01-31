import { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import useStore, { GALLERY_CATEGORIES } from '../store/useStore'

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

  // Group items by category
  const getItemsByCategory = (category) => {
    return galleryItems.filter(item => item.category === category)
  }

  // Category section component
  const CategorySection = ({ categoryId, items }) => {
    const category = GALLERY_CATEGORIES[categoryId]
    if (!items || items.length === 0) return null

    return (
      <div className="mb-12">
        {/* Category Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xl">{category.icon}</span>
          <h3 className="text-xl font-bold text-[#d4af37]">{category.label}</h3>
          <div className="flex-1 h-px bg-[#d4af37]/20" />
          <span className="text-xs text-gray-500">{items.length} פריטים</span>
        </div>

        {/* Items Grid - smaller thumbnails */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="gallery-item relative group cursor-pointer rounded-md overflow-hidden bg-[#1a1a1a] aspect-square"
              onClick={() => openLightbox(item)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 right-0 left-0 p-2">
                  <p className="text-xs font-medium text-white truncate">
                    {item.title}
                  </p>
                </div>
              </div>

              {/* Gold Border on Hover */}
              <div className="absolute inset-0 border border-transparent group-hover:border-[#d4af37]/60 transition-colors duration-300 rounded-md pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section id="gallery" className="py-16 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            <span className="text-[#d4af37]">הגלריה</span> שלנו
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            מבחר מהעבודות האחרונות שלנו. כל יצירה מעוצבת בהתאמה אישית.
          </p>
          <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mt-4" />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="spinner" />
          </div>
        )}

        {/* Categorized Gallery */}
        {!isLoading && (
          <div>
            <CategorySection
              categoryId="tattoo"
              items={getItemsByCategory('tattoo')}
            />
            <CategorySection
              categoryId="art"
              items={getItemsByCategory('art')}
            />
            <CategorySection
              categoryId="merch"
              items={getItemsByCategory('merch')}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && galleryItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">אין עבודות להצגה כרגע</p>
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
            className="absolute top-4 left-4 text-white hover:text-[#d4af37] transition-colors z-10"
            onClick={closeLightbox}
            aria-label="סגור"
          >
            <FaTimes size={24} />
          </button>

          <div
            className="max-w-3xl max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 right-0 left-0 p-4 bg-gradient-to-t from-black/90 to-transparent rounded-b-lg">
              <h3 className="text-lg font-bold text-white">
                {selectedImage.title}
              </h3>
              <span className="text-xs text-[#d4af37]">
                {GALLERY_CATEGORIES[selectedImage.category]?.label}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Gallery
