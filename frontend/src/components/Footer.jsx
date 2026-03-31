import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>© {new Date().getFullYear()} Armenian Driving Exam Prep. Built for Armenian drivers.</p>
    </footer>
  )
}