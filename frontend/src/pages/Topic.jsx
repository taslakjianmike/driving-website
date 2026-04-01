import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getQuestionsByTopic, getTopics } from '../api/index.js'
import styles from './Topic.module.css'

export default function Topic() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [topicName, setTopicName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visible, setVisible] = useState(false)
  const gridRef = useRef(null)

  useEffect(() => {
    Promise.all([
      getQuestionsByTopic(topicId),
      getTopics()
    ])
      .then(([questionsRes, topicsRes]) => {
        setQuestions(questionsRes.data)
        const topic = topicsRes.data.find(t => t.id === parseInt(topicId))
        setTopicName(topic ? topic.name : 'Topic')
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [topicId])

  useEffect(() => {
    if (!gridRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    observer.observe(gridRef.current)
    return () => observer.disconnect()
  }, [loading])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className={styles.page}>
      <div className={styles.nav}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ← Back to topics
        </button>
        <div className={styles.navCenter}>
          <span className={styles.navTitle}>{topicName}</span>
          <span className={styles.navSubtitle}>{questions.length} questions</span>
        </div>
        <div className={styles.navSpacer} />
      </div>

      <div className={styles.container}>
        <div className={styles.grid} ref={gridRef}>
          {questions.map((question, index) => (
            <button
              key={question.id}
              className={`${styles.questionButton} ${visible ? styles.buttonVisible : ''}`}
              style={{ animationDelay: `${Math.min(index * 20, 600)}ms` }}
              onClick={() => navigate(`/topic/${topicId}/question/${question.id}`)}
            >
              <span className={styles.questionNumber}>{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}