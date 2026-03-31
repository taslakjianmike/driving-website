import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTopics } from '../api/index.js'
import styles from './Home.module.css'

const ICONS = ['🚗', '🚕', '🛻', '🚙', '🚦', '🛑', '⚠️', '🔄', '➡️', '🅿️']

function FloatingIcon({ icon, style }) {
  return (
    <span className={styles.floatingIcon} style={style}>
      {icon}
    </span>
  )
}

function generateIcons(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    icon: ICONS[i % ICONS.length],
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      fontSize: `${20 + Math.random() * 28}px`,
      animationDuration: `${6 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 6}s`,
      opacity: 0.3 + Math.random() * 0.45,
    }
  }))
}

export default function Home() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [icons] = useState(() => generateIcons(22))
  const navigate = useNavigate()
  const topicsRef = useRef(null)

  useEffect(() => {
    getTopics()
      .then(res => setTopics(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function handleStartPracticing() {
    topicsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className={styles.page}>
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
          <button className={styles.heroButton} onClick={handleStartPracticing}>
            Start Practicing
          </button>
        </div>
      </section>

      <section className={styles.topicsSection} ref={topicsRef}>
        <h2 className={styles.topicsHeading}>Choose a Topic</h2>
        <div className={styles.topicList}>
          {topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => navigate(`/topic/${topic.id}`)}
              className={styles.topicButton}
            >
              {topic.name}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}