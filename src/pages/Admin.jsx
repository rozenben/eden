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
  FaUpload,
  FaCalendarAlt,
  FaClock,
  FaCheck,
  FaHourglass,
  FaCheckCircle,
  FaChevronRight,
  FaChevronLeft,
  FaBan,
  FaUser,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa'
import useStore from '../store/useStore'

// Hebrew day names
const hebrewDays = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']
const hebrewDaysFull = {
  sunday: 'ראשון',
  monday: 'שני',
  tuesday: 'שלישי',
  wednesday: 'רביעי',
  thursday: 'חמישי',
  friday: 'שישי',
  saturday: 'שבת'
}
const hebrewMonths = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
]

const categoryLabels = {
  tattoo: 'קעקוע',
  painting: 'ציור בהזמנה',
  merch: 'ייעוץ מרצ\'נדייז'
}

const statusLabels = {
  pending: 'ממתין',
  confirmed: 'מאושר',
  completed: 'הושלם'
}

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  confirmed: 'bg-green-500/20 text-green-500 border-green-500/30',
  completed: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

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

// Appointments Manager
const AppointmentsManager = () => {
  const {
    appointments,
    fetchAppointments,
    updateAppointmentStatus,
    deleteAppointment,
    isLoading
  } = useStore()

  const [filter, setFilter] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true
    return apt.status === filter
  }).sort((a, b) => new Date(a.date) - new Date(b.date))

  const handleStatusChange = async (id, status) => {
    await updateAppointmentStatus(id, status)
  }

  const handleDelete = async (id) => {
    if (window.confirm('האם למחוק את התור?')) {
      await deleteAppointment(id)
    }
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#d4af37]/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FaCalendarAlt className="text-[#d4af37]" />
          ניהול תורים
        </h3>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter === status
                  ? 'bg-[#d4af37] text-black'
                  : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
              }`}
            >
              {status === 'all' ? 'הכל' : statusLabels[status]}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="spinner" />
        </div>
      )}

      {!isLoading && filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <FaCalendarAlt size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">אין תורים {filter !== 'all' && statusLabels[filter]}</p>
        </div>
      )}

      {!isLoading && filteredAppointments.length > 0 && (
        <div className="space-y-4">
          {filteredAppointments.map(apt => (
            <div
              key={apt.id}
              className="bg-[#2a2a2a] rounded-xl p-4 border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-white">{apt.fullName}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs border ${statusColors[apt.status]}`}>
                      {statusLabels[apt.status]}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-[#d4af37]" />
                      {new Date(apt.date).toLocaleDateString('he-IL')} | {apt.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-[#d4af37]" />
                      {apt.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-[#d4af37]" />
                      {apt.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#d4af37]">סוג:</span>
                      {categoryLabels[apt.category]}
                    </div>
                  </div>

                  {apt.description && (
                    <p className="mt-2 text-sm text-gray-500 bg-[#1a1a1a] p-2 rounded">
                      {apt.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2">
                  {apt.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'confirmed')}
                      className="flex items-center gap-1 px-3 py-2 bg-green-500/20 text-green-500 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                    >
                      <FaCheck />
                      אשר
                    </button>
                  )}
                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'completed')}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-500/20 text-blue-500 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
                    >
                      <FaCheckCircle />
                      הושלם
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(apt.id)}
                    className="flex items-center gap-1 px-3 py-2 bg-red-500/20 text-red-500 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                  >
                    <FaTrash />
                    מחק
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Admin Calendar View
const AdminCalendar = () => {
  const { appointments, blockedDates, addBlockedDate, removeBlockedDate } = useStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const formatDateStr = (date) => {
    if (!date) return null
    return date.toISOString().split('T')[0]
  }

  const getAppointmentsForDate = (date) => {
    if (!date) return []
    const dateStr = formatDateStr(date)
    return appointments.filter(apt => apt.date === dateStr)
  }

  const toggleBlockedDate = async (date) => {
    const dateStr = formatDateStr(date)
    if (blockedDates.includes(dateStr)) {
      await removeBlockedDate(dateStr)
    } else {
      await addBlockedDate(dateStr)
    }
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#d4af37]/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FaCalendarAlt className="text-[#d4af37]" />
          תצוגת לוח שנה
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors text-[#d4af37]"
          >
            <FaChevronRight />
          </button>
          <span className="text-white font-medium min-w-[120px] text-center">
            {hebrewMonths[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors text-[#d4af37]"
          >
            <FaChevronLeft />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {hebrewDays.map((day, index) => (
          <div key={index} className="text-center text-gray-500 text-sm py-2 font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dateStr = date ? formatDateStr(date) : null
          const dayAppointments = getAppointmentsForDate(date)
          const isBlocked = dateStr && blockedDates.includes(dateStr)
          const isToday = dateStr === formatDateStr(new Date())
          const isPast = date && date < new Date().setHours(0, 0, 0, 0)

          return (
            <div
              key={index}
              className={`
                min-h-[80px] p-1 rounded-lg border transition-all
                ${!date ? 'invisible' : ''}
                ${isBlocked ? 'bg-red-500/10 border-red-500/30' : 'border-[#d4af37]/10 hover:border-[#d4af37]/30'}
                ${isToday ? 'border-[#d4af37]' : ''}
                ${isPast ? 'opacity-50' : ''}
              `}
            >
              {date && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isToday ? 'text-[#d4af37]' : 'text-gray-400'}`}>
                      {date.getDate()}
                    </span>
                    {!isPast && (
                      <button
                        onClick={() => toggleBlockedDate(date)}
                        className={`p-1 rounded text-xs ${
                          isBlocked ? 'text-red-500 hover:text-red-400' : 'text-gray-500 hover:text-gray-400'
                        }`}
                        title={isBlocked ? 'הסר חסימה' : 'חסום תאריך'}
                      >
                        <FaBan size={12} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map(apt => (
                      <div
                        key={apt.id}
                        className={`text-xs px-1 py-0.5 rounded truncate ${
                          apt.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                          apt.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-gray-500/20 text-gray-400'
                        }`}
                        title={`${apt.fullName} - ${apt.time}`}
                      >
                        {apt.time} {apt.fullName.split(' ')[0]}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500 px-1">
                        +{dayAppointments.length - 2} נוספים
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[#d4af37]/10">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/30" />
          <span className="text-gray-400">ממתין</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30" />
          <span className="text-gray-400">מאושר</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded bg-red-500/10 border border-red-500/30" />
          <span className="text-gray-400">חסום</span>
        </div>
      </div>
    </div>
  )
}

// Working Hours Manager
const WorkingHoursManager = () => {
  const { workingHours, updateWorkingHours, fetchWorkingHours } = useStore()
  const [hours, setHours] = useState(workingHours)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchWorkingHours()
  }, [fetchWorkingHours])

  useEffect(() => {
    setHours(workingHours)
  }, [workingHours])

  const handleChange = (day, field, value) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }))
  }

  const handleSave = async () => {
    await updateWorkingHours(hours)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#d4af37]/20">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FaClock className="text-[#d4af37]" />
        שעות פעילות
      </h3>

      <div className="space-y-3">
        {dayOrder.map(day => (
          <div
            key={day}
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg ${
              hours[day]?.enabled ? 'bg-[#2a2a2a]' : 'bg-[#2a2a2a]/50'
            }`}
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="checkbox"
                checked={hours[day]?.enabled || false}
                onChange={(e) => handleChange(day, 'enabled', e.target.checked)}
                className="w-5 h-5 accent-[#d4af37]"
              />
              <span className={`font-medium w-16 ${hours[day]?.enabled ? 'text-white' : 'text-gray-500'}`}>
                {hebrewDaysFull[day]}
              </span>
            </div>

            {hours[day]?.enabled && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="time"
                  value={hours[day]?.start || '10:00'}
                  onChange={(e) => handleChange(day, 'start', e.target.value)}
                  className="bg-[#1a1a1a] border border-[#d4af37]/20 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                />
                <span className="text-gray-500">עד</span>
                <input
                  type="time"
                  value={hours[day]?.end || '20:00'}
                  onChange={(e) => handleChange(day, 'end', e.target.value)}
                  className="bg-[#1a1a1a] border border-[#d4af37]/20 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-6 w-full bg-[#d4af37] text-black py-3 rounded-lg font-bold hover:bg-[#f4d03f] transition-colors flex items-center justify-center gap-2"
      >
        {saved ? (
          'נשמר בהצלחה!'
        ) : (
          <>
            <FaSave />
            שמור שינויים
          </>
        )}
      </button>
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
    { name: 'workingHours', label: 'שעות פעילות (טקסט)', type: 'text' }
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

              <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                <p className="text-white text-sm truncate">{item.title}</p>
              </div>

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
  const { isDemo, fetchBlockedDates } = useStore()
  const [activeTab, setActiveTab] = useState('appointments')

  useEffect(() => {
    fetchBlockedDates()
  }, [fetchBlockedDates])

  const tabs = [
    { id: 'appointments', label: 'תורים', icon: FaCalendarAlt },
    { id: 'calendar', label: 'לוח שנה', icon: FaCalendarAlt },
    { id: 'hours', label: 'שעות פעילות', icon: FaClock },
    { id: 'gallery', label: 'גלריה', icon: FaImage },
    { id: 'settings', label: 'הגדרות', icon: FaSave }
  ]

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

      {/* Tabs */}
      <div className="bg-[#1a1a1a] border-b border-[#d4af37]/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'appointments' && <AppointmentsManager />}
        {activeTab === 'calendar' && <AdminCalendar />}
        {activeTab === 'hours' && <WorkingHoursManager />}
        {activeTab === 'gallery' && <GalleryManager />}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <SettingsPanel />
          </div>
        )}
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
