import { createContext, useContext, useState } from 'react'

export const LANGUAGES = [
  { code: 'hy', label: 'HY', name: 'Հայերեն' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'AR', name: 'العربية' },
  { code: 'fa', label: 'FA', name: 'فارسی' },
  { code: 'ru', label: 'RU', name: 'Русский' },
]

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('lang') || 'hy'
  )

  function changeLanguage(code) {
    localStorage.setItem('lang', code)
    setLanguage(code)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}