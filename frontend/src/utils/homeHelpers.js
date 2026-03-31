import { useEffect, useState } from 'react'

const ICONS = ['🚗', '🚕', '🛻', '🚙', '🚦', '🛑', '⚠️', '🔄', '➡️', '🅿️']

export function generateIcons(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    icon: ICONS[i % ICONS.length],
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      fontSize: `${20 + Math.random() * 28}px`,
      animationDuration: `${6 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 6}s`,
      opacity: 0.3 + Math.random() * 0.25,
    }
  }))
}

export function useCountUp(target, duration, triggered) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!triggered) return
    let start = 0
    const steps = 60
    const increment = target / steps
    const interval = duration / steps
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, interval)
    return () => clearInterval(timer)
  }, [triggered, target, duration])

  return count
}