import { useNavigate } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className={styles.nav}>
      <button className={styles.logo} onClick={() => navigate('/')}>
        🚗 Driving Exam
      </button>
      <LanguageSwitcher />
    </nav>
  )
}