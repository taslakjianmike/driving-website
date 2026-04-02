import { useLanguage } from '../context/LanguageContext.jsx'
import styles from './LanguageSwitcher.module.css'

export default function LanguageSwitcher() {
  const { language, changeLanguage, LANGUAGES } = useLanguage()

  return (
    <div className={styles.switcher}>
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          className={`${styles.langButton} ${language === lang.code ? styles.active : ''}`}
          onClick={() => changeLanguage(lang.code)}
          title={lang.name}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}