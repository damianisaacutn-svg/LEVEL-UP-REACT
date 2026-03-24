import { useEffect, useState } from 'react'
import {
  getUsersGrowth,
  getEnrollmentsByCourse,
  getRolesDistribution,
  getActivityLast24h,
  getMonthlyCount,
  getDashboardStats,
  getQuickSummary,
} from '../services/dashboardService'
import { calculateGrowth } from '../services/dashboardUtils'

export const useDashboardData = () => {
  const [charts, setCharts] = useState({})
  const [growth, setGrowth] = useState({})
  const [stats, setStats] = useState({})
  const [summary, setSummary] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)

      const [
        // 📊 CHARTS
        usersGrowth,
        enrollments,
        roles,
        activity,

        // 📈 GROWTH
        usersMonthly,
        coursesMonthly,
        quizzesMonthly,

        // 📊 STATS
        statsData,

        // ⚡ SUMMARY
        summaryData,
      ] = await Promise.all([
        getUsersGrowth(),
        getEnrollmentsByCourse(),
        getRolesDistribution(),
        getActivityLast24h(),

        getMonthlyCount('usuario'),
        getMonthlyCount('curso'),
        getMonthlyCount('quiz'),

        getDashboardStats(),
        getQuickSummary(),
      ])

      // ==========================
      // 📊 CHARTS
      // ==========================
      setCharts({
        usersGrowth,
        enrollments,
        roles,
        activity,
      })

      // ==========================
      // 📈 GROWTH
      // ==========================
      setGrowth({
        users: calculateGrowth(usersMonthly.current, usersMonthly.previous),
        courses: calculateGrowth(coursesMonthly.current, coursesMonthly.previous),
        quizzes: calculateGrowth(quizzesMonthly.current, quizzesMonthly.previous),
      })

      // ==========================
      // 📊 STATS
      // ==========================
      setStats(statsData)

      // ==========================
      // ⚡ SUMMARY
      // ==========================
      setSummary(summaryData)
    } catch (error) {
      console.error('❌ Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  return { charts, growth, stats, summary, loading }
}
