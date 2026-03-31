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

export default function Hero({ onStartPracticing }) {
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
          1,011 questions across 10 topics — study at your own pace and pass with confidence.
        </p>
        <button className={styles.heroButton} onClick={onStartPracticing}>
          Start Practicing
        </button>
      </div>
    </section>
  )
}