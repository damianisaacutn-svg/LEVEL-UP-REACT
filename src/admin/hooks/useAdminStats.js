import { useEffect, useState } from 'react'
import { getAdminStats } from '../services/adminService'

export default function useAdminStats() {
  const [stats, setStats] = useState({
    users: 0,
    instructors: 0,
    courses: 0,
    videos: 0,
    quizzes: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await getAdminStats()

      setStats(data)
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading }
}
