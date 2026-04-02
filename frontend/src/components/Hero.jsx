import { useRef, useState } from 'react'
import { generateIcons } from '../utils/homeHelpers.js'
import styles from './Hero.module.css'

function FloatingIcon({ icon, style }) {
  return (
    <span className={styles.floatingIcon} style={style}>
      {icon}
    </span>
  )
}

export default function Hero({ onStartPracticing, totalQuestions, subtitle, startPracticingLabel }) {
  const [icons] = useState(() => generateIcons(22))

  return (
    <section className={styles.hero}>
      <div className={styles.floatingBg}>
        {icons.map(({ id, icon, style }) => (
          <FloatingIcon key={id} icon={icon} style={style} />
        ))}
      </div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Driving Exam Prep</h1>
        <p className={styles.heroSubtitle}>
          {totalQuestions.toLocaleString()} {subtitle}
        </p>
        <button className={styles.heroButton} onClick={onStartPracticing}>
          {startPracticingLabel}
        </button>
      </div>
    </section>
  )
}