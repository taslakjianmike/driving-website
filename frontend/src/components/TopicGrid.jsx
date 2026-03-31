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

export default function TopicGrid({ topics }) {
  const navigate = useNavigate()

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Choose a Topic</h2>
      <div className={styles.grid}>
        {topics.map(topic => (
          <button
            key={topic.id}
            className={styles.card}
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