import { useEffect, useState } from 'react'
import { getAdminStats, getPendingContent, getRecentActivity } from '../services/adminService'

export default function useAdminDashboard() {
  const [metrics, setMetrics] = useState({})
  const [pending, setPending] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    const stats = await getAdminStats()
    const pendingContent = await getPendingContent()
    const activityData = await getRecentActivity()

    setMetrics(stats)
    setPending(pendingContent)
    setActivity(activityData)

    setLoading(false)
  }

  return {
    metrics,
    pending,
    activity,
    loading,
  }
}
