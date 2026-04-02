import { useLanguage } from '../context/LanguageContext.jsx'
import styles from './PitchSection.module.css'

const CONTENT = {
  hy: {
    heading: 'Անցեք քննությունը վստահությամբ',
    subtitle: 'Հայաստանի վարորդական տեսական քննությունը մեկ տեղում — բոլոր հարցերը, բոլոր լեզուներով, բացատրություններով։',
    pillars: [
      { icon: '🌍', title: '5 լեզու', description: 'Պարապեք հայերեն, անգլերեն, արաբերեն, ֆարսիերեն կամ ռուսերեն — ձեզ հարմար լեզվով։' },
      { icon: '📚', title: 'Բոլոր հարցերը', description: 'Քննության բոլոր հարցերը 10 թեմայով, որպեսզի ոչ մի բան անակնկալ չլինի։' },
      { icon: '💡', title: 'Բացատրություններ', description: 'Յուրաքանչյուր պատասխան ուղեկցվում է բացատրությամբ, որպեսզի հասկանաք, ոչ թե պարզապես անգիր անեք։' },
      { icon: '✅', title: 'Հանձնեք վստահությամբ', description: 'Պարապեք ձեր տեմպով և մտեք քննություն պատրաստված։' },
    ]
  },
  en: {
    heading: 'Everything You Need to Pass',
    subtitle: 'The Armenian driving theory exam in one place — all questions, all languages, all explained.',
    pillars: [
      { icon: '🌍', title: 'All 5 Languages', description: 'Study in English, Armenian, Arabic, Farsi, or Russian — whichever feels most natural to you.' },
      { icon: '📚', title: 'Every Question Covered', description: 'All official exam questions across 10 topics, so nothing catches you off guard on exam day.' },
      { icon: '💡', title: 'Clear Explanations', description: 'Every answer comes with an explanation so you understand the why, not just memorize the what.' },
      { icon: '✅', title: 'Pass with Confidence', description: 'Practice at your own pace, track your progress, and walk into the exam ready.' },
    ]
  },
  ar: {
    heading: 'كل ما تحتاجه للنجاح',
    subtitle: 'امتحان نظرية القيادة الأرمني في مكان واحد — جميع الأسئلة، بجميع اللغات، مع الشرح.',
    pillars: [
      { icon: '🌍', title: '5 لغات', description: 'ادرس بالعربية أو الأرمنية أو الإنجليزية أو الفارسية أو الروسية — أيها يناسبك.' },
      { icon: '📚', title: 'جميع الأسئلة', description: 'جميع أسئلة الامتحان الرسمي في 10 مواضيع حتى لا يفاجئك شيء.' },
      { icon: '💡', title: 'شرح واضح', description: 'كل إجابة مصحوبة بشرح حتى تفهم السبب وليس فقط تحفظ الجواب.' },
      { icon: '✅', title: 'انجح بثقة', description: 'تدرب بالسرعة التي تناسبك واجتز الامتحان بكل ثقة.' },
    ]
  },
  fa: {
    heading: 'همه چیز برای قبولی',
    subtitle: 'آزمون نظری رانندگی ارمنستان در یک جا — همه سوالات، همه زبان‌ها، با توضیحات.',
    pillars: [
      { icon: '🌍', title: '۵ زبان', description: 'به فارسی، ارمنی، انگلیسی، عربی یا روسی مطالعه کنید — هر کدام که راحت‌ترید.' },
      { icon: '📚', title: 'همه سوالات', description: 'تمام سوالات رسمی آزمون در ۱۰ موضوع تا هیچ چیزی غافلگیرتان نکند.' },
      { icon: '💡', title: 'توضیحات روشن', description: 'هر جواب با توضیح همراه است تا دلیل را بفهمید نه فقط حفظ کنید.' },
      { icon: '✅', title: 'با اطمینان قبول شوید', description: 'با سرعت خودتان تمرین کنید و آماده وارد آزمون شوید.' },
    ]
  },
  ru: {
    heading: 'Всё необходимое для сдачи',
    subtitle: 'Теоретический экзамен по вождению в Армении в одном месте — все вопросы, все языки, с объяснениями.',
    pillars: [
      { icon: '🌍', title: 'Все 5 языков', description: 'Учитесь на русском, армянском, английском, арабском или фарси — как вам удобнее.' },
      { icon: '📚', title: 'Все вопросы', description: 'Все официальные вопросы экзамена по 10 темам, чтобы ничто не застало врасплох.' },
      { icon: '💡', title: 'Чёткие объяснения', description: 'К каждому ответу есть объяснение, чтобы вы понимали суть, а не просто заучивали.' },
      { icon: '✅', title: 'Сдайте уверенно', description: 'Занимайтесь в своём темпе и входите на экзамен подготовленными.' },
    ]
  },
}

export default function PitchSection() {
  const { language } = useLanguage()
  const c = CONTENT[language]

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{c.heading}</h2>
        <p className={styles.subtitle}>{c.subtitle}</p>
      </div>
      <div className={styles.grid}>
        {c.pillars.map((pillar, index) => (
          <div
            key={pillar.title}
            className={styles.card}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <span className={styles.icon}>{pillar.icon}</span>
            <h3 className={styles.cardTitle}>{pillar.title}</h3>
            <p className={styles.cardDescription}>{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}