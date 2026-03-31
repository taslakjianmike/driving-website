import { useEffect, useRef, useState } from 'react'
import { getTopics } from '../api/index.js'
import Hero from '../components/Hero.jsx'
import StatStrip from '../components/StatStrip.jsx'
import TopicGrid from '../components/TopicGrid.jsx'
import styles from './Home.module.css'

export default function Home() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
      <div ref={topicsRef}>
        <TopicGrid topics={topics} />
      </div>
    </div>
  )
}