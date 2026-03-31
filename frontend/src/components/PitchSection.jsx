import styles from './PitchSection.module.css'

const PILLARS = [
  {
    icon: '🌍',
    title: 'All 5 Languages',
    description: 'Study in English, Armenian, Arabic, Farsi, or Russian — whichever feels most natural to you.',
  },
  {
    icon: '📚',
    title: 'Every Question Covered',
    description: 'All 1,011 official exam questions across 10 topics, so nothing catches you off guard on exam day.',
  },
  {
    icon: '💡',
    title: 'Clear Explanations',
    description: 'Every answer comes with an explanation so you understand the why, not just memorize the what.',
  },
  {
    icon: '✅',
    title: 'Pass with Confidence',
    description: 'Practice at your own pace, track your progress, and walk into the exam ready.',
  },
]

export default function PitchSection() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Everything You Need to Pass</h2>
        <p className={styles.subtitle}>
          The Armenian driving theory exam in one place — all questions, all languages, all explained.
        </p>
      </div>
      <div className={styles.grid}>
        {PILLARS.map(pillar => (
          <div key={pillar.title} className={styles.card}>
            <span className={styles.icon}>{pillar.icon}</span>
            <h3 className={styles.cardTitle}>{pillar.title}</h3>
            <p className={styles.cardDescription}>{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}