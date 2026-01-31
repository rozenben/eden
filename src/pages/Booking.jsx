import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaPaintBrush,
  FaCheck,
  FaChevronRight,
  FaChevronLeft
} from 'react-icons/fa'
import useStore from '../store/useStore'

// Hebrew day names
const hebrewDays = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']
const hebrewDaysFull = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
const hebrewMonths = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
]

// Category options
const categories = [
  { value: 'tattoo', label: 'קעקוע', icon: '🎨' },
  { value: 'painting', label: 'ציור בהזמנה', icon: '🖼️' },
  { value: 'merch', label: 'ייעוץ מרצ\'נדייז', icon: '👕' }
]

// Calendar Component
const Calendar = ({ selectedDate, onSelectDate, blockedDates, workingHours }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const isDateDisabled = (date) => {
    if (!date) return true

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Can't book past dates
    if (date < today) return true

    // Check if date is blocked
    const dateStr = date.toISOString().split('T')[0]
    if (blockedDates.includes(dateStr)) return true

    // Check working hours
    const dayOfWeek = date.getDay()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayConfig = workingHours[dayNames[dayOfWeek]]

    return !dayConfig?.enabled
  }

  const formatDateStr = (date) => {
    if (!date) return null
    return date.toISOString().split('T')[0]
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#d4af37]/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors text-[#d4af37]"
        >
          <FaChevronRight />
        </button>
        <h3 className="text-lg font-bold text-white">
          {hebrewMonths[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors text-[#d4af37]"
        >
          <FaChevronLeft />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {hebrewDays.map((day, index) => (
          <div key={index} className="text-center text-gray-500 text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const isDisabled = isDateDisabled(date)
          const isSelected = selectedDate && date && formatDateStr(date) === selectedDate
          const isToday = date && formatDateStr(date) === formatDateStr(new Date())

          return (
            <button
              key={index}
              onClick={() => !isDisabled && date && onSelectDate(formatDateStr(date))}
              disabled={isDisabled}
              className={`
                aspect-square p-2 rounded-lg text-sm font-medium transition-all
                ${!date ? 'invisible' : ''}
                ${isDisabled ? 'text-gray-600 cursor-not-allowed' : 'hover:bg-[#d4af37]/20 cursor-pointer'}
                ${isSelected ? 'bg-[#d4af37] text-black' : ''}
                ${isToday && !isSelected ? 'border border-[#d4af37]/50' : ''}
              `}
            >
              {date?.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Time Slots Component
const TimeSlots = ({ selectedDate, selectedTime, onSelectTime, getAvailableTimeSlots }) => {
  const slots = selectedDate ? getAvailableTimeSlots(selectedDate) : []

  if (!selectedDate) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#d4af37]/20 text-center">
        <FaClock className="text-4xl text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500">בחר תאריך כדי לראות שעות פנויות</p>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#d4af37]/20 text-center">
        <FaClock className="text-4xl text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500">אין שעות פנויות בתאריך זה</p>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#d4af37]/20">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <FaClock className="text-[#d4af37]" />
        בחר שעה
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map(({ time, available }) => (
          <button
            key={time}
            onClick={() => available && onSelectTime(time)}
            disabled={!available}
            className={`
              py-3 px-4 rounded-lg text-sm font-medium transition-all
              ${!available ? 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed line-through' : 'hover:bg-[#d4af37]/20 bg-[#2a2a2a]'}
              ${selectedTime === time ? 'bg-[#d4af37] text-black' : 'text-white'}
            `}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  )
}

// Success Message Component
const SuccessMessage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <FaCheck className="text-3xl text-black" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">תודה רבה!</h1>
        <p className="text-gray-400 mb-8">
          הבקשה שלך התקבלה בהצלחה. האמן ייצור איתך קשר בהקדם כדי לאשר את התור.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#f4d03f] transition-colors"
        >
          <FaArrowRight />
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  )
}

// Main Booking Page
const Booking = () => {
  const {
    addAppointment,
    fetchWorkingHours,
    fetchBlockedDates,
    fetchAppointments,
    getAvailableTimeSlots,
    workingHours,
    blockedDates,
    isLoading
  } = useStore()

  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    category: '',
    description: '',
    date: '',
    time: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchWorkingHours()
    fetchBlockedDates()
    fetchAppointments()
  }, [fetchWorkingHours, fetchBlockedDates, fetchAppointments])

  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'שדה חובה'
    if (!formData.phone.trim()) newErrors.phone = 'שדה חובה'
    if (!formData.email.trim()) newErrors.email = 'שדה חובה'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'אימייל לא תקין'
    if (!formData.category) newErrors.category = 'בחר קטגוריה'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!formData.date) newErrors.date = 'בחר תאריך'
    if (!formData.time) newErrors.time = 'בחר שעה'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateStep2()) return

    try {
      await addAppointment(formData)
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting booking:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  if (submitted) {
    return <SuccessMessage />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#d4af37]/20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#d4af37]">קביעת תור</h1>
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FaArrowRight />
            חזרה
          </Link>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#d4af37]' : 'text-gray-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#d4af37] text-black' : 'bg-[#2a2a2a]'}`}>
              1
            </div>
            <span className="hidden sm:inline">פרטים אישיים</span>
          </div>
          <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-[#d4af37]' : 'bg-[#2a2a2a]'}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#d4af37]' : 'text-gray-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#d4af37] text-black' : 'bg-[#2a2a2a]'}`}>
              2
            </div>
            <span className="hidden sm:inline">תאריך ושעה</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#d4af37]/20 fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">פרטים אישיים</h2>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    <FaUser className="inline ml-2" />
                    שם מלא
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full bg-[#2a2a2a] border ${errors.fullName ? 'border-red-500' : 'border-[#d4af37]/20'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors`}
                    placeholder="הכנס שם מלא..."
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    <FaPhone className="inline ml-2" />
                    טלפון
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full bg-[#2a2a2a] border ${errors.phone ? 'border-red-500' : 'border-[#d4af37]/20'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors`}
                    placeholder="054-1234567"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    <FaEnvelope className="inline ml-2" />
                    אימייל
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-[#2a2a2a] border ${errors.email ? 'border-red-500' : 'border-[#d4af37]/20'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors`}
                    placeholder="example@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    <FaPaintBrush className="inline ml-2" />
                    סוג השירות
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {categories.map(cat => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category: cat.value }))
                          if (errors.category) setErrors(prev => ({ ...prev, category: null }))
                        }}
                        className={`p-4 rounded-lg border transition-all text-center ${
                          formData.category === cat.value
                            ? 'bg-[#d4af37] border-[#d4af37] text-black'
                            : 'bg-[#2a2a2a] border-[#d4af37]/20 text-white hover:border-[#d4af37]/50'
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{cat.icon}</span>
                        <span className="font-medium">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    תיאור הרעיון / בקשה
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-[#2a2a2a] border border-[#d4af37]/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                    placeholder="תאר את הרעיון שלך, גודל משוער, מיקום וכו'..."
                  />
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-[#d4af37] text-black py-4 rounded-lg font-bold text-lg hover:bg-[#f4d03f] transition-colors flex items-center justify-center gap-2"
                >
                  המשך לבחירת תאריך
                  <FaChevronLeft />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div className="fade-in">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Calendar */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="text-[#d4af37]" />
                    בחר תאריך
                  </h3>
                  <Calendar
                    selectedDate={formData.date}
                    onSelectDate={(date) => {
                      setFormData(prev => ({ ...prev, date, time: '' }))
                      if (errors.date) setErrors(prev => ({ ...prev, date: null }))
                    }}
                    blockedDates={blockedDates}
                    workingHours={workingHours}
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-2">{errors.date}</p>}
                </div>

                {/* Time Slots */}
                <div>
                  <TimeSlots
                    selectedDate={formData.date}
                    selectedTime={formData.time}
                    onSelectTime={(time) => {
                      setFormData(prev => ({ ...prev, time }))
                      if (errors.time) setErrors(prev => ({ ...prev, time: null }))
                    }}
                    getAvailableTimeSlots={getAvailableTimeSlots}
                  />
                  {errors.time && <p className="text-red-500 text-sm mt-2">{errors.time}</p>}
                </div>
              </div>

              {/* Summary */}
              {formData.date && formData.time && (
                <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#d4af37]/20 mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">סיכום ההזמנה</h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-gray-400">
                    <div>
                      <span className="text-gray-500">שם:</span> {formData.fullName}
                    </div>
                    <div>
                      <span className="text-gray-500">טלפון:</span> {formData.phone}
                    </div>
                    <div>
                      <span className="text-gray-500">שירות:</span> {categories.find(c => c.value === formData.category)?.label}
                    </div>
                    <div>
                      <span className="text-gray-500">תאריך ושעה:</span>{' '}
                      {new Date(formData.date).toLocaleDateString('he-IL')} בשעה {formData.time}
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-[#2a2a2a] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#3a3a3a] transition-colors flex items-center justify-center gap-2"
                >
                  <FaChevronRight />
                  חזור
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.date || !formData.time}
                  className="flex-1 bg-[#d4af37] text-black py-4 rounded-lg font-bold text-lg hover:bg-[#f4d03f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="spinner w-6 h-6" />
                  ) : (
                    <>
                      <FaCheck />
                      שלח בקשה
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Booking
