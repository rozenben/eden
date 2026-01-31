import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FaHome,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage,
  FaSave,
  FaTimes,
  FaUpload
} from 'react-icons/fa'
import useStore from '../store/useStore'

// Login Component
const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const success = onLogin(password)
    if (!success) {
      setError('סיסמה שגויה')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#d4af37] mb-2">ממשק ניהול</h1>
          <p className="text-gray-400">הכנס סיסמה כדי להיכנס</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#d4af37]/20">
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              placeholder="הכנס סיסמה..."
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#d4af37] text-black py-3 rounded-lg font-bold hover:bg-[#f4d03f] transition-colors"
          >
            התחברות
          </button>

          <Link
            to="/"
            className="block text-center text-gray-500 hover:text-gray-300 mt-4 transition-colors"
          >
            חזרה לאתר
          </Link>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          סיסמת ברירת מחדל: admin123
        </p>
      </div>
    </div>
  )
}

// Image Upload Modal
const ImageUploadModal = ({ isOpen, onClose, onUpload, editItem = null }) => {
  const [title, setTitle] = useState(editItem?.title || '')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(editItem?.imageUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title)
      setPreview(editItem.imageUrl)
    } else {
      setTitle('')
      setFile(null)
      setPreview(null)
    }
  }, [editItem, isOpen])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || (!file && !editItem)) return

    setIsUploading(true)
    try {
      await onUpload(title, file, editItem?.id)
      onClose()
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
      <div
        className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-lg border border-[#d4af37]/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {editItem ? 'עריכת תמונה' : 'הוספת תמונה חדשה'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">תמונה</label>
            <div
              className="upload-area rounded-lg p-8 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg object-contain"
                />
              ) : (
                <div className="text-gray-500">
                  <FaUpload size={32} className="mx-auto mb-2 text-[#d4af37]/50" />
                  <p>לחץ לבחירת תמונה</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">כותרת</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              placeholder="הכנס כותרת..."
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#2a2a2a] text-white py-3 rounded-lg font-bold hover:bg-[#3a3a3a] transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={isUploading || (!file && !editItem)}
              className="flex-1 bg-[#d4af37] text-black py-3 rounded-lg font-bold hover:bg-[#f4d03f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <div className="spinner w-5 h-5" />
              ) : (
                <>
                  <FaSave />
                  {editItem ? 'עדכון' : 'הוספה'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Settings Panel
const SettingsPanel = () => {
  const { siteContent, updateSiteContent, isLoading } = useStore()
  const [formData, setFormData] = useState(siteContent)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setFormData(siteContent)
  }, [siteContent])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateSiteContent(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const fields = [
    { name: 'heroTitle', label: 'כותרת ראשית', type: 'text' },
    { name: 'heroSubtitle', label: 'תת כותרת', type: 'text' },
    { name: 'heroDescription', label: 'תיאור', type: 'textarea' },
    { name: 'instagramUrl', label: 'קישור אינסטגרם', type: 'url' },
    { name: 'contactPhone', label: 'טלפון', type: 'tel' },
    { name: 'contactEmail', label: 'אימייל', type: 'email' },
    { name: 'contactAddress', label: 'כתובת', type: 'text' },
    { name: 'workingHours', label: 'שעות פעילות', type: 'text' }
  ]

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#d4af37]/20">
      <h3 className="text-xl font-bold text-white mb-6">הגדרות האתר</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-gray-400 text-sm mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                rows={3}
                className="w-full bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="w-full bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#d4af37] text-black py-3 rounded-lg font-bold hover:bg-[#f4d03f] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="spinner w-5 h-5" />
          ) : saved ? (
            'נשמר בהצלחה!'
          ) : (
            <>
              <FaSave />
              שמור שינויים
            </>
          )}
        </button>
      </form>
    </div>
  )
}

// Gallery Manager
const GalleryManager = () => {
  const {
    galleryItems,
    fetchGalleryItems,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    isLoading
  } = useStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchGalleryItems()
  }, [fetchGalleryItems])

  const handleUpload = async (title, file, itemId = null) => {
    if (itemId) {
      await updateGalleryItem(itemId, { title }, file)
    } else {
      await addGalleryItem(file, title)
    }
  }

  const handleEdit = (item) => {
    setEditItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    await deleteGalleryItem(id)
    setDeleteConfirm(null)
  }

  const openAddModal = () => {
    setEditItem(null)
    setIsModalOpen(true)
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#d4af37]/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">ניהול גלריה</h3>
        <button
          onClick={openAddModal}
          className="bg-[#d4af37] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#f4d03f] transition-colors flex items-center gap-2"
        >
          <FaPlus />
          הוסף תמונה
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="spinner" />
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="relative group bg-[#2a2a2a] rounded-lg overflow-hidden"
            >
              <div className="aspect-square">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center text-black hover:bg-[#f4d03f] transition-colors"
                  title="עריכה"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => setDeleteConfirm(item.id)}
                  className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                  title="מחיקה"
                >
                  <FaTrash />
                </button>
              </div>

              {/* Title */}
              <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                <p className="text-white text-sm truncate">{item.title}</p>
              </div>

              {/* Delete Confirmation */}
              {deleteConfirm === item.id && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4">
                  <p className="text-white text-center mb-4">למחוק את התמונה?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-500"
                    >
                      מחק
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-500"
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!isLoading && galleryItems.length === 0 && (
        <div className="text-center py-12">
          <FaImage size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">אין תמונות בגלריה</p>
          <button
            onClick={openAddModal}
            className="mt-4 text-[#d4af37] hover:underline"
          >
            הוסף תמונה ראשונה
          </button>
        </div>
      )}

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditItem(null)
        }}
        onUpload={handleUpload}
        editItem={editItem}
      />
    </div>
  )
}

// Main Admin Dashboard
const AdminDashboard = ({ onLogout }) => {
  const { isDemo } = useStore()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#d4af37]/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#d4af37]">ממשק ניהול</h1>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <FaHome />
              <span className="hidden sm:inline">לאתר</span>
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">התנתק</span>
            </button>
          </div>
        </div>
      </header>

      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="bg-[#d4af37]/10 border-b border-[#d4af37]/20 px-4 py-3">
          <p className="text-center text-[#d4af37] text-sm">
            מצב דמו - השינויים נשמרים מקומית בלבד. הגדר Firebase כדי לשמור באופן קבוע.
          </p>
        </div>
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings - Takes 1 column */}
          <div className="lg:col-span-1">
            <SettingsPanel />
          </div>

          {/* Gallery Manager - Takes 2 columns */}
          <div className="lg:col-span-2">
            <GalleryManager />
          </div>
        </div>
      </main>
    </div>
  )
}

// Main Admin Component
const Admin = () => {
  const { isAuthenticated, login, logout, checkAuth, checkDemoMode } = useStore()

  useEffect(() => {
    checkAuth()
    checkDemoMode()
  }, [checkAuth, checkDemoMode])

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />
  }

  return <AdminDashboard onLogout={logout} />
}

export default Admin
