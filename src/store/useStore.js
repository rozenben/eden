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
import { db, storage } from '../config/firebase'

// Demo data for when Firebase is not configured
const demoGalleryItems = [
  {
    id: '1',
    title: 'דרקון יפני',
    imageUrl: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=500&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'פרחים גיאומטריים',
    imageUrl: 'https://images.unsplash.com/photo-1590246814883-55516d8c2afd?w=400&h=500&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'נמר ריאליסטי',
    imageUrl: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=400&h=500&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'מנדלה מסורתית',
    imageUrl: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=400&h=500&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'ורד שחור',
    imageUrl: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=400&h=500&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    title: 'גלים יפניים',
    imageUrl: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=400&h=500&fit=crop',
    createdAt: new Date().toISOString()
  }
]

const demoSiteContent = {
  heroTitle: 'אומנות על העור',
  heroSubtitle: 'סטודיו לקעקועים מקצועי בתל אביב',
  heroDescription: 'אנחנו מתמחים ביצירת קעקועים ייחודיים ומותאמים אישית. כל עבודה היא יצירת אומנות.',
  instagramUrl: 'https://instagram.com/inkstudio',
  contactPhone: '054-1234567',
  contactEmail: 'info@inkstudio.co.il',
  contactAddress: 'רחוב דיזנגוף 123, תל אביב',
  workingHours: 'ראשון-חמישי: 10:00-20:00 | שישי: 10:00-14:00'
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

  // Check if using demo mode
  checkDemoMode: () => {
    const isDemoMode = !import.meta.env.VITE_FIREBASE_API_KEY ||
                       import.meta.env.VITE_FIREBASE_API_KEY === 'demo-api-key'
    set({ isDemo: isDemoMode })
    return isDemoMode
  },

  // Fetch gallery items
  fetchGalleryItems: async () => {
    set({ isLoading: true, error: null })

    const isDemoMode = get().checkDemoMode()

    if (isDemoMode) {
      // Use demo data
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
        // Initialize with demo content if not exists
        await setDoc(docRef, demoSiteContent)
        set({ siteContent: demoSiteContent })
      }
    } catch (error) {
      console.error('Error fetching site content:', error)
      set({ siteContent: demoSiteContent })
    }
  },

  // Add gallery item
  addGalleryItem: async (file, title) => {
    set({ isLoading: true, error: null })

    const isDemoMode = get().checkDemoMode()

    if (isDemoMode) {
      // Demo mode - add to local state with object URL
      const newItem = {
        id: Date.now().toString(),
        title,
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
      // Upload image to Firebase Storage
      const fileName = `gallery/${Date.now()}_${file.name}`
      const storageRef = ref(storage, fileName)
      await uploadBytes(storageRef, file)
      const imageUrl = await getDownloadURL(storageRef)

      // Add document to Firestore
      const docRef = await addDoc(collection(db, 'gallery'), {
        title,
        imageUrl,
        fileName,
        createdAt: new Date().toISOString()
      })

      const newItem = {
        id: docRef.id,
        title,
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
      // Demo mode - update local state
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

      // If new file provided, upload it
      if (newFile) {
        const fileName = `gallery/${Date.now()}_${newFile.name}`
        const storageRef = ref(storage, fileName)
        await uploadBytes(storageRef, newFile)
        const imageUrl = await getDownloadURL(storageRef)

        // Delete old image if exists
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
      // Demo mode - remove from local state
      set(state => ({
        galleryItems: state.galleryItems.filter(item => item.id !== id),
        isLoading: false
      }))
      return
    }

    try {
      const currentItem = get().galleryItems.find(item => item.id === id)

      // Delete from Firestore
      await deleteDoc(doc(db, 'gallery', id))

      // Delete image from Storage
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
      // Demo mode - update local state
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
