import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getQuestionsByTopic } from '../api/index.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import styles from './Question.module.css'

export default function Question() {
  const { topicId, questionId } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getQuestionsByTopic(topicId)
      .then(res => {
        const allQuestions = res.data
        setQuestions(allQuestions)
        const index = allQuestions.findIndex(q => q.id === parseInt(questionId))
        setCurrentIndex(index)
        setCurrentQuestion(allQuestions[index])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [topicId, questionId])

  function getQuestionText(question) {
    if (language === 'hy') return question.question_text
    return question[`question_text_${language}`] || question.question_text
  }

  function getAnswerText(answer) {
    if (language === 'hy') return answer.text
    return answer[`text_${language}`] || answer.text
  }

  function getExplanation(question) {
    if (language === 'hy') return question.explanation_hy
    return question[`explanation_${language}`] || question.explanation_hy
  }

  function handleAnswer(answerNumber) {
    if (selected !== null) return
    setSelected(answerNumber)
  }

  function handleNext() {
    const next = questions[currentIndex + 1]
    navigate(`/topic/${topicId}/question/${next.id}`)
    setSelected(null)
  }

  function handlePrev() {
    const prev = questions[currentIndex - 1]
    navigate(`/topic/${topicId}/question/${prev.id}`)
    setSelected(null)
  }

  function getAnswerClass(answerNumber) {
    if (selected === null) return styles.answerButton
    if (answerNumber === currentQuestion.correct_answer) return `${styles.answerButton} ${styles.correct}`
    if (answerNumber === selected) return `${styles.answerButton} ${styles.incorrect}`
    return styles.answerButton
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (!currentQuestion) return <p>Question not found</p>

  const explanation = getExplanation(currentQuestion)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.nav}>
          <button
            className={styles.navButton}
            onClick={() => navigate(`/topic/${topicId}`)}
          >
            All questions
          </button>
          <span className={styles.questionNumber}>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className={styles.navButtons}>
            <button
              className={styles.navButton}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button
              className={styles.navButton}
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
            >
              Next
            </button>
          </div>
        </div>

        <div className={styles.questionArea}>
          <span className={styles.badge}>Q{currentIndex + 1}</span>
          <p className={styles.questionText}>{getQuestionText(currentQuestion)}</p>
          {currentQuestion.image_url && (
            <div className={styles.imageCard}>
              <img
                src={`http://localhost:3001${currentQuestion.image_url}`}
                alt="Question"
                className={styles.image}
              />
            </div>
          )}
        </div>

        <div className={styles.answers}>
          {currentQuestion.answers.filter(a => a !== null).map(answer => (
            <button
              key={answer.id}
              className={getAnswerClass(answer.number)}
              onClick={() => handleAnswer(answer.number)}
            >
              <span className={styles.answerBadge}>{answer.number}</span>
              <span className={styles.answerText}>{getAnswerText(answer)}</span>
            </button>
          ))}
        </div>

        {selected !== null && explanation && (
          <div className={styles.explanation}>
            <span className={styles.explanationLabel}>Explanation</span>
            <p className={styles.explanationText}>{explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}