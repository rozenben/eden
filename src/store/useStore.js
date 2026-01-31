import { create } from 'zustand'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { db, storage, isFirebaseConfigured } from '../config/firebase'

// Gallery categories
export const GALLERY_CATEGORIES = {
  tattoo: { id: 'tattoo', label: 'קעקועים', icon: '🎨' },
  art: { id: 'art', label: 'אומנות', icon: '🖼️' },
  merch: { id: 'merch', label: 'מרצ\'נדייז', icon: '👕' }
}

// Demo data for when Firebase is not configured
const demoGalleryItems = [
  {
    id: '1',
    title: 'דרקון יפני',
    category: 'tattoo',
    imageUrl: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=500&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'פרחים גיאומטריים',
    category: 'tattoo',
    imageUrl: 'https://images.unsplash.com/photo-1590246814883-55516d8c2afd?w=400&h=500&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'נמר ריאליסטי',
    category: 'tattoo',
    imageUrl: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=400&h=500&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'מנדלה מסורתית',
    category: 'tattoo',
    imageUrl: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=400&h=500&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'ציור שמן - נוף עירוני',
    category: 'art',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    title: 'פורטרט בהזמנה',
    category: 'art',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    title: 'חולצה מאויירת',
    category: 'merch',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    title: 'הדפס ממוסגר',
    category: 'merch',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400&h=500&fit=crop',
    createdAt: new Date().toISOString()
  }
]

const demoSiteContent = {
  heroTitle: 'Rak.Eden',
  heroSubtitle: 'סטודיו לקעקועים ואומנות בתל אביב',
  heroDescription: 'אנחנו מתמחים ביצירת קעקועים ייחודיים, ציורים בהזמנה ומוצרי אומנות מותאמים אישית. כל עבודה היא יצירת אומנות.',
  instagramUrl: 'https://instagram.com/rak.eden',
  contactPhone: '054-1234567',
  contactEmail: 'info@rakeden.co.il',
  contactAddress: 'רחוב דיזנגוף 123, תל אביב',
  workingHours: 'ראשון-חמישי: 10:00-20:00 | שישי: 10:00-14:00'
}

// Demo appointments
const demoAppointments = [
  {
    id: '1',
    fullName: 'ישראל ישראלי',
    phone: '054-1234567',
    email: 'israel@example.com',
    category: 'tattoo',
    description: 'קעקוע של דרקון יפני על הזרוע',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '14:00',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    fullName: 'שרה כהן',
    phone: '052-9876543',
    email: 'sara@example.com',
    category: 'painting',
    description: 'ציור שמן בהזמנה - נוף ים תיכוני',
    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    time: '11:00',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  }
]

// Default working hours
const defaultWorkingHours = {
  sunday: { enabled: true, start: '10:00', end: '20:00' },
  monday: { enabled: true, start: '10:00', end: '20:00' },
  tuesday: { enabled: true, start: '10:00', end: '20:00' },
  wednesday: { enabled: true, start: '10:00', end: '20:00' },
  thursday: { enabled: true, start: '10:00', end: '20:00' },
  friday: { enabled: true, start: '10:00', end: '14:00' },
  saturday: { enabled: false, start: '10:00', end: '14:00' }
}

const useStore = create((set, get) => ({
  // Gallery state
  galleryItems: [],
  isLoading: false,
  error: null,

  // Site content state
  siteContent: demoSiteContent,

  // Auth state
  isAuthenticated: false,
  isDemo: true,

  // Booking state
  appointments: [],
  workingHours: defaultWorkingHours,
  blockedDates: [],
  blockedDateRanges: [], // New: date ranges

  // Check if using demo mode
  checkDemoMode: () => {
    const isDemoMode = !isFirebaseConfigured
    set({ isDemo: isDemoMode })
    return isDemoMode
  },

  // Get gallery items by category
  getGalleryByCategory: (category) => {
    const items = get().galleryItems
    if (!category || category === 'all') return items
    return items.filter(item => item.category === category)
  },

  // Fetch gallery items
  fetchGalleryItems: async () => {
    set({ isLoading: true, error: null })

    const isDemoMode = get().checkDemoMode()

    if (isDemoMode) {
      set({ galleryItems: demoGalleryItems, isLoading: false })
      return
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'gallery'))
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      set({ galleryItems: items, isLoading: false })
    } catch (error) {
      console.error('Error fetching gallery:', error)
      set({ error: error.message, isLoading: false, galleryItems: demoGalleryItems })
    }
  },

  // Fetch site content
  fetchSiteContent: async () => {
    const isDemoMode = get().checkDemoMode()

    if (isDemoMode) {
      set({ siteContent: demoSiteContent })
      return
    }

    try {
      const docRef = doc(db, 'settings', 'siteContent')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        set({ siteContent: docSnap.data() })
      } else {
        await setDoc(docRef, demoSiteContent)
        set({ siteContent: demoSiteContent })
      }
    } catch (error) {
      console.error('Error fetching site content:', error)
      set({ siteContent: demoSiteContent })
    }
  },

  // Add gallery item with category
  addGalleryItem: async (file, title, category = 'tattoo') => {
    set({ isLoading: true, error: null })

    const isDemoMode = get().checkDemoMode()

    if (isDemoMode) {
      const newItem = {
        id: Date.now().toString(),
        title,
        category,
        imageUrl: URL.createObjectURL(file),
        createdAt: new Date().toISOString()
      }
      set(state => ({
        galleryItems: [newItem, ...state.galleryItems],
        isLoading: false
      }))
      return newItem
    }

    try {
      const fileName = `gallery/${Date.now()}_${file.name}`
      const storageRef = ref(storage, fileName)
      await uploadBytes(storageRef, file)
      const imageUrl = await getDownloadURL(storageRef)

      const docRef = await addDoc(collection(db, 'gallery'), {
        title,
        category,
        imageUrl,
        fileName,
        createdAt: new Date().toISOString()
      })

      const newItem = {
        id: docRef.id,
        title,
        category,
        imageUrl,
        fileName,
        createdAt: new Date().toISOString()
      }

      set(state => ({
        galleryItems: [newItem, ...state.galleryItems],
        isLoading: false
      }))

      return newItem
    } catch (error) {
      console.error('Error adding gallery item:', error)
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // Update gallery item
  updateGalleryItem: async (id, updates, newFile = null) => {
    set({ isLoading: true, error: null })

    const isDemoMode = get().checkDemoMode()

    if (isDemoMode) {
      set(state => ({
        galleryItems: state.galleryItems.map(item =>
          item.id === id
            ? {
                ...item,
                ...updates,
                imageUrl: newFile ? URL.createObjectURL(newFile) : item.imageUrl
              }
            : item
        ),
        isLoading: false
      }))
      return
    }

    try {
      const docRef = doc(db, 'gallery', id)
      let updateData = { ...updates }

      if (newFile) {
        const fileName = `gallery/${Date.now()}_${newFile.name}`
        const storageRef = ref(storage, fileName)
        await uploadBytes(storageRef, newFile)
        const imageUrl = await getDownloadURL(storageRef)

        const currentItem = get().galleryItems.find(item => item.id === id)
        if (currentItem?.fileName) {
          try {
            const oldRef = ref(storage, currentItem.fileName)
            await deleteObject(oldRef)
          } catch (e) {
            console.warn('Could not delete old image:', e)
          }
        }

        updateData = { ...updateData, imageUrl, fileName }
      }

      await updateDoc(docRef, updateData)

      set(state => ({
        galleryItems: state.galleryItems.map(item =>
          item.id === id ? { ...item, ...updateData } : item
        ),
        isLoading: false
      }))
    } catch (error) {
      console.error('Error updating gallery item:', error)
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // Delete gallery item
  deleteGalleryItem: async (id) => {
    set({ isLoading: true, error: null })

    const isDemoMode = get().checkDemoMode()

    if (isDemoMode) {
      set(state => ({
        galleryItems: state.galleryItems.filter(item => item.id !== id),
        isLoading: false
      }))
      return
    }

    try {
      const currentItem = get().galleryItems.find(item => item.id === id)

      await deleteDoc(doc(db, 'gallery', id))

      if (currentItem?.fileName) {
        try {
          const storageRef = ref(storage, currentItem.fileName)
          await deleteObject(storageRef)
        } catch (e) {
          console.warn('Could not delete image from storage:', e)
        }
      }

      set(state => ({
        galleryItems: state.galleryItems.filter(item => item.id !== id),
        isLoading: false
      }))
    } catch (error) {
      console.error('Error deleting gallery item:', error)
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // Update site content
  updateSiteContent: async (updates) => {
    set({ isLoading: true, error: null })

    const isDemoMode = get().checkDemoMode()

    if (isDemoMode) {
      set(state => ({
        siteContent: { ...state.siteContent, ...updates },
        isLoading: false
      }))
      return
    }

    try {
      const docRef = doc(db, 'settings', 'siteContent')
      await setDoc(docRef, { ...get().siteContent, ...updates }, { merge: true })

      set(state => ({
        siteContent: { ...state.siteContent, ...updates },
        isLoading: false
      }))
    } catch (error) {
      console.error('Error updating site content:', error)
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // ============ BOOKING SYSTEM ============

  // Fetch appointments
  fetchAppointments: async () => {
    set({ isLoading: true, error: null })

    const isDemoMode = get().checkDemoMode()

    if (isDemoMode) {
      set({ appointments: demoAppointments, isLoading: false })
      return
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'appointments'))
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      set({ appointments: items, isLoading: false })
    } catch (error) {
      console.error('Error fetching appointments:', error)
      set({ error: error.message, isLoading: false, appointments: demoAppointments })
    }
  },

  // Add appointment (client booking)
  addAppointment: async (appointmentData) => {
    set({ isLoading: true, error: null })

    const isDemoMode = get().checkDemoMode()

    const newAppointment = {
      ...appointmentData,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    if (isDemoMode) {
      const appointmentWithId = {
        id: Date.now().toString(),
        ...newAppointment
      }
      set(state => ({
        appointments: [...state.appointments, appointmentWithId],
        isLoading: false
      }))

      console.log('📧 Email notification (mock):', {
        to: 'artist@rakeden.co.il',
        subject: 'הזמנה חדשה!',
        body: `התקבלה הזמנה חדשה מ-${appointmentData.fullName} לתאריך ${appointmentData.date} בשעה ${appointmentData.time}`
      })

      return appointmentWithId
    }

    try {
      const docRef = await addDoc(collection(db, 'appointments'), newAppointment)

      const appointmentWithId = {
        id: docRef.id,
        ...newAppointment
      }

      set(state => ({
        appointments: [...state.appointments, appointmentWithId],
        isLoading: false
      }))

      console.log('📧 Email notification (mock):', {
        to: 'artist@rakeden.co.il',
        subject: 'הזמנה חדשה!',
        body: `התקבלה הזמנה חדשה מ-${appointmentData.fullName} לתאריך ${appointmentData.date} בשעה ${appointmentData.time}`
      })

      return appointmentWithId
    } catch (error) {
      console.error('Error adding appointment:', error)
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status) => {
    set({ isLoading: true, error: null })

    const isDemoMode = get().checkDemoMode()

    if (isDemoMode) {
      set(state => ({
        appointments: state.appointments.map(apt =>
          apt.id === id ? { ...apt, status } : apt
        ),
        isLoading: false
      }))
      return
    }

    try {
      const docRef = doc(db, 'appointments', id)
      await updateDoc(docRef, { status })

      set(state => ({
        appointments: state.appointments.map(apt =>
          apt.id === id ? { ...apt, status } : apt
        ),
        isLoading: false
      }))
    } catch (error) {
      console.error('Error updating appointment:', error)
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    set({ isLoading: true, error: null })

    const isDemoMode = get().checkDemoMode()

    if (isDemoMode) {
      set(state => ({
        appointments: state.appointments.filter(apt => apt.id !== id),
        isLoading: false
      }))
      return
    }

    try {
      await deleteDoc(doc(db, 'appointments', id))

      set(state => ({
        appointments: state.appointments.filter(apt => apt.id !== id),
        isLoading: false
      }))
    } catch (error) {
      console.error('Error deleting appointment:', error)
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // Fetch working hours
  fetchWorkingHours: async () => {
    const isDemoMode = get().checkDemoMode()

    if (isDemoMode) {
      const saved = localStorage.getItem('workingHours')
      if (saved) {
        set({ workingHours: JSON.parse(saved) })
      }
      return
    }

    try {
      const docRef = doc(db, 'settings', 'workingHours')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        set({ workingHours: docSnap.data() })
      }
    } catch (error) {
      console.error('Error fetching working hours:', error)
    }
  },

  // Update working hours
  updateWorkingHours: async (hours) => {
    const isDemoMode = get().checkDemoMode()

    if (isDemoMode) {
      localStorage.setItem('workingHours', JSON.stringify(hours))
      set({ workingHours: hours })
      return
    }

    try {
      const docRef = doc(db, 'settings', 'workingHours')
      await setDoc(docRef, hours)
      set({ workingHours: hours })
    } catch (error) {
      console.error('Error updating working hours:', error)
      throw error
    }
  },

  // Fetch blocked dates and ranges
  fetchBlockedDates: async () => {
    const isDemoMode = get().checkDemoMode()

    if (isDemoMode) {
      const savedDates = localStorage.getItem('blockedDates')
      const savedRanges = localStorage.getItem('blockedDateRanges')
      if (savedDates) {
        set({ blockedDates: JSON.parse(savedDates) })
      }
      if (savedRanges) {
        set({ blockedDateRanges: JSON.parse(savedRanges) })
      }
      return
    }

    try {
      const docRef = doc(db, 'settings', 'blockedDates')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        set({
          blockedDates: data.dates || [],
          blockedDateRanges: data.ranges || []
        })
      }
    } catch (error) {
      console.error('Error fetching blocked dates:', error)
    }
  },

  // Add blocked date
  addBlockedDate: async (date) => {
    const isDemoMode = get().checkDemoMode()
    const currentBlocked = get().blockedDates

    if (currentBlocked.includes(date)) return

    const newBlocked = [...currentBlocked, date]

    if (isDemoMode) {
      localStorage.setItem('blockedDates', JSON.stringify(newBlocked))
      set({ blockedDates: newBlocked })
      return
    }

    try {
      const docRef = doc(db, 'settings', 'blockedDates')
      await setDoc(docRef, { dates: newBlocked, ranges: get().blockedDateRanges }, { merge: true })
      set({ blockedDates: newBlocked })
    } catch (error) {
      console.error('Error adding blocked date:', error)
      throw error
    }
  },

  // Remove blocked date
  removeBlockedDate: async (date) => {
    const isDemoMode = get().checkDemoMode()
    const newBlocked = get().blockedDates.filter(d => d !== date)

    if (isDemoMode) {
      localStorage.setItem('blockedDates', JSON.stringify(newBlocked))
      set({ blockedDates: newBlocked })
      return
    }

    try {
      const docRef = doc(db, 'settings', 'blockedDates')
      await setDoc(docRef, { dates: newBlocked, ranges: get().blockedDateRanges }, { merge: true })
      set({ blockedDates: newBlocked })
    } catch (error) {
      console.error('Error removing blocked date:', error)
      throw error
    }
  },

  // Add blocked date range
  addBlockedDateRange: async (startDate, endDate, reason = '') => {
    const isDemoMode = get().checkDemoMode()
    const currentRanges = get().blockedDateRanges

    const newRange = {
      id: Date.now().toString(),
      startDate,
      endDate,
      reason,
      createdAt: new Date().toISOString()
    }

    const newRanges = [...currentRanges, newRange]

    if (isDemoMode) {
      localStorage.setItem('blockedDateRanges', JSON.stringify(newRanges))
      set({ blockedDateRanges: newRanges })
      return newRange
    }

    try {
      const docRef = doc(db, 'settings', 'blockedDates')
      await setDoc(docRef, { dates: get().blockedDates, ranges: newRanges }, { merge: true })
      set({ blockedDateRanges: newRanges })
      return newRange
    } catch (error) {
      console.error('Error adding blocked date range:', error)
      throw error
    }
  },

  // Remove blocked date range
  removeBlockedDateRange: async (rangeId) => {
    const isDemoMode = get().checkDemoMode()
    const newRanges = get().blockedDateRanges.filter(r => r.id !== rangeId)

    if (isDemoMode) {
      localStorage.setItem('blockedDateRanges', JSON.stringify(newRanges))
      set({ blockedDateRanges: newRanges })
      return
    }

    try {
      const docRef = doc(db, 'settings', 'blockedDates')
      await setDoc(docRef, { dates: get().blockedDates, ranges: newRanges }, { merge: true })
      set({ blockedDateRanges: newRanges })
    } catch (error) {
      console.error('Error removing blocked date range:', error)
      throw error
    }
  },

  // Check if date is in any blocked range
  isDateInBlockedRange: (date) => {
    const { blockedDateRanges } = get()
    const checkDate = new Date(date)

    return blockedDateRanges.some(range => {
      const start = new Date(range.startDate)
      const end = new Date(range.endDate)
      return checkDate >= start && checkDate <= end
    })
  },

  // Check if date is blocked (single date or in range)
  isDateBlocked: (date) => {
    const { blockedDates } = get()
    return blockedDates.includes(date) || get().isDateInBlockedRange(date)
  },

  // Check if time slot is available
  isTimeSlotAvailable: (date, time) => {
    const { appointments, workingHours } = get()

    // Check if date is blocked
    if (get().isDateBlocked(date)) return false

    // Check working hours for that day
    const dayOfWeek = new Date(date).getDay()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayConfig = workingHours[dayNames[dayOfWeek]]

    if (!dayConfig?.enabled) return false

    // Check if time is within working hours
    if (time < dayConfig.start || time >= dayConfig.end) return false

    // Check if slot is already booked
    const existingAppointment = appointments.find(
      apt => apt.date === date && apt.time === time && apt.status !== 'completed'
    )

    return !existingAppointment
  },

  // Get available time slots for a date
  getAvailableTimeSlots: (date) => {
    const { workingHours, appointments } = get()

    if (get().isDateBlocked(date)) return []

    const dayOfWeek = new Date(date).getDay()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayConfig = workingHours[dayNames[dayOfWeek]]

    if (!dayConfig?.enabled) return []

    const slots = []
    const startHour = parseInt(dayConfig.start.split(':')[0])
    const endHour = parseInt(dayConfig.end.split(':')[0])

    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`
      const isBooked = appointments.some(
        apt => apt.date === date && apt.time === time && apt.status !== 'completed'
      )
      slots.push({ time, available: !isBooked })
    }

    return slots
  },

  // Admin authentication (simple password-based)
  login: (password) => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
    if (password === adminPassword) {
      set({ isAuthenticated: true })
      localStorage.setItem('isAdminAuthenticated', 'true')
      return true
    }
    return false
  },

  logout: () => {
    set({ isAuthenticated: false })
    localStorage.removeItem('isAdminAuthenticated')
  },

  checkAuth: () => {
    const isAuth = localStorage.getItem('isAdminAuthenticated') === 'true'
    set({ isAuthenticated: isAuth })
    return isAuth
  }
}))

export default useStore
