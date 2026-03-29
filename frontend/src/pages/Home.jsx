import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTopics } from '../api/index.js'
import styles from './Home.module.css'

export default function Home() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getTopics()
      .then(res => setTopics(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Armenian Driving Theory</h1>
      <p className={styles.subtitle}>Select a topic to practice</p>
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
    </div>
  )
}