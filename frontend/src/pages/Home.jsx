import { useEffect, useRef, useState } from 'react'
import { getTopics } from '../api/index.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import Hero from '../components/Hero.jsx'
import StatStrip from '../components/StatStrip.jsx'
import PitchSection from '../components/PitchSection.jsx'
import TopicGrid from '../components/TopicGrid.jsx'
import Footer from '../components/Footer.jsx'
import styles from './Home.module.css'

const UI_TEXT = {
  hy: {
    title: 'Վարորդական քննության նախապատրաստություն',
    chooseATopic: 'Ընտրեք թեմա',
    heroSubtitle: 'Բոլոր հարցերը 10 թեմայով — պատրաստվեք և հաջողությամբ հանձնեք քննությունը։',
    startPracticing: 'Սկսել պարապմունքը',
  },
  en: {
    title: 'Driving Exam Prep',
    chooseATopic: 'Choose a Topic',
    heroSubtitle: 'questions across 10 topics — study at your own pace and pass with confidence.',
    startPracticing: 'Start Practicing',
  },
  ar: {
    title: 'التحضير لامتحان القيادة',
    chooseATopic: 'اختر موضوعاً',
    heroSubtitle: 'سؤال في 10 مواضيع — ادرس بالسرعة التي تناسبك واجتز الامتحان بثقة.',
    startPracticing: 'ابدأ التدريب',
  },
  fa: {
    title: 'آمادگی برای آزمون رانندگی',
    chooseATopic: 'یک موضوع انتخاب کنید',
    heroSubtitle: 'سوال در ۱۰ موضوع — با سرعت خودتان مطالعه کنید و با اطمینان قبول شوید.',
    startPracticing: 'شروع تمرین',
  },
  ru: {
    title: 'Подготовка к экзамену по вождению',
    chooseATopic: 'Выберите тему',
    heroSubtitle: 'вопросов по 10 темам — учитесь в своём темпе и сдайте экзамен уверенно.',
    startPracticing: 'Начать практику',
  },
}

export default function Home() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { language } = useLanguage()
  const topicsRef = useRef(null)
  const t = UI_TEXT[language]

  useEffect(() => {
    getTopics()
      .then(res => setTopics(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function handleStartPracticing() {
    topicsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const totalQuestions = topics.reduce((sum, t) => sum + parseInt(t.question_count), 0)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className={styles.page}>
      <Hero
        onStartPracticing={handleStartPracticing}
        totalQuestions={totalQuestions}
        title={t.title}
        subtitle={t.heroSubtitle}
        startPracticingLabel={t.startPracticing}
      />
      <StatStrip totalQuestions={totalQuestions} />
      <PitchSection />
      <div ref={topicsRef} className={styles.topicsWrapper}>
        <TopicGrid topics={topics} heading={t.chooseATopic} />
      </div>
      <Footer />
    </div>
  )
}