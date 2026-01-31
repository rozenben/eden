# INK STUDIO - אתר סטודיו לקעקועים

אתר מודרני ורספונסיבי לסטודיו קעקועים, עם תמיכה מלאה בעברית ו-RTL.

## תכונות

### צד לקוח (ציבורי)
- **Hero Section** - כותרת מרשימה עם כפתור "קבע תור"
- **אינטגרציית אינסטגרם** - כפתור מעוצב לפתיחת פרופיל האינסטגרם
- **גלריה** - תצוגת גריד רספונסיבית של עבודות עם כותרות
- **צור קשר** - פרטי יצירת קשר ומיקום הסטודיו

### צד מנהל (מוגן)
- **דשבורד** - נתיב מוגן בסיסמה (`/admin`)
- **פעולות CRUD** - העלאה, עריכה ומחיקה של תמונות
- **עדכון תוכן** - עריכת כותרות ותיאורים

## טכנולוגיות

- **React + Vite** - Frontend framework
- **Tailwind CSS** - Styling
- **Firebase** - Storage & Firestore
- **Zustand** - State management
- **React Router** - Routing

## התקנה

```bash
# התקנת dependencies
npm install

# הרצה בסביבת פיתוח
npm run dev

# בנייה לייצור
npm run build
```

## הגדרת Firebase

1. צור פרויקט חדש ב-Firebase Console
2. הפעל Authentication, Firestore, ו-Storage
3. העתק את קובץ `.env.example` ל-`.env`
4. מלא את פרטי ההגדרות של Firebase

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_ADMIN_PASSWORD=your-secure-password
```

## מצב דמו

ללא הגדרת Firebase, האתר יעבוד במצב דמו עם נתונים מקומיים.

- סיסמת ברירת מחדל למנהל: `admin123`
- שינויים נשמרים מקומית בלבד

## מבנה הפרויקט

```
src/
├── components/     # רכיבי UI
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── Gallery.jsx
│   ├── Contact.jsx
│   └── Footer.jsx
├── pages/          # דפים
│   ├── Home.jsx
│   └── Admin.jsx
├── store/          # Zustand store
│   └── useStore.js
├── config/         # הגדרות
│   └── firebase.js
├── App.jsx
├── main.jsx
└── index.css
```

## רישיון

MIT
