import { useEffect, useRef, useState } from 'react'
import { useCountUp } from '../utils/homeHelpers.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import styles from './StatStrip.module.css'

const LABELS = {
  hy: { questions: 'Հարցեր', languages: 'Լեզուներ' },
  en: { questions: 'Questions', languages: 'Languages' },
  ar: { questions: 'أسئلة', languages: 'لغات' },
  fa: { questions: 'سوالات', languages: 'زبان‌ها' },
  ru: { questions: 'Вопросов', languages: 'Языков' },
}

export default function StatStrip({ totalQuestions }) {
  const [triggered, setTriggered] = useState(false)
  const { language } = useLanguage()
  const ref = useRef(null)
  const l = LABELS[language]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true) },
      { threshold: 0.4 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const questions = useCountUp(totalQuestions, 1200, triggered)
  const languages = useCountUp(5, 800, triggered)

  return (
    <div className={styles.statStrip} ref={ref}>
      <div className={styles.stat}>
        <span className={styles.statNumber}>{questions.toLocaleString()}</span>
        <span className={styles.statLabel}>{l.questions}</span>
      </div>
      <div className={styles.statDivider} />
      <div className={styles.stat}>
        <span className={styles.statNumber}>{languages}</span>
        <span className={styles.statLabel}>{l.languages}</span>
      </div>
    </div>
  )
}