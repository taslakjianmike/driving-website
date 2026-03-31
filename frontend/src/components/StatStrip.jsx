import { useEffect, useRef, useState } from 'react'
import { useCountUp } from '../utils/homeHelpers.js'
import styles from './StatStrip.module.css'

export default function StatStrip() {
  const [triggered, setTriggered] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true) },
      { threshold: 0.4 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const questions = useCountUp(1011, 1200, triggered)
  const languages = useCountUp(5, 800, triggered)

  return (
    <div className={styles.statStrip} ref={ref}>
      <div className={styles.stat}>
        <span className={styles.statNumber}>{questions.toLocaleString()}</span>
        <span className={styles.statLabel}>Questions</span>
      </div>
      <div className={styles.statDivider} />
      <div className={styles.stat}>
        <span className={styles.statNumber}>{languages}</span>
        <span className={styles.statLabel}>Languages</span>
      </div>
    </div>
  )
}