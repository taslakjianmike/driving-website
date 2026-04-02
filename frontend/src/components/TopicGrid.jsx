import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './TopicGrid.module.css'

const TOPIC_ICONS = {
  11: '🔀',
  12: '📋',
  13: '🔧',
  14: '🪧',
  15: '🚦',
  16: '🚥',
  17: '🅿️',
  18: '🚗',
  19: '📣',
  20: '🩺',
}

export default function TopicGrid({ topics, heading }) {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.grid} ref={ref}>
        {topics.map((topic, index) => (
          <button
            key={topic.id}
            className={`${styles.card} ${visible ? styles.cardVisible : ''}`}
            style={{ animationDelay: `${index * 60}ms` }}
            onClick={() => navigate(`/topic/${topic.id}`)}
          >
            <span className={styles.icon}>{TOPIC_ICONS[topic.id]}</span>
            <span className={styles.name}>{topic.name}</span>
            <span className={styles.count}>{topic.question_count} questions</span>
          </button>
        ))}
      </div>
    </section>
  )
}