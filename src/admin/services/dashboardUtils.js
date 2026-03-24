export const getMonthRange = (date = new Date()) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  }
}

export const getPreviousMonthRange = () => {
  const now = new Date()
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  return getMonthRange(prev)
}

export const calculateGrowth = (current, previous) => {
  if (!previous || previous === 0) return 100
  return ((current - previous) / previous) * 100
}
