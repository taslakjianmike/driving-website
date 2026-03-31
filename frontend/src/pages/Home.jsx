import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTopics } from '../api/index.js'
import Hero from '../components/Hero.jsx'
import StatStrip from '../components/StatStrip.jsx'
import styles from './Home.module.css'

export default function Home() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
      <Hero onStartPracticing={handleStartPracticing} />
      <StatStrip />
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