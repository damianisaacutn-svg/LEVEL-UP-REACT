import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

export default function ActivityInsightCard({
  type = 'info',
  title,
  mainValue,
  subtitle,
  status = 'ok',
}) {
  const styles = getCardStyles(type, status)
  const Icon = styles.icon

  return (
    <div className={`rounded-[24px] px-3 py-3 text-white ${styles.bg}`}>
      <div className="flex items-start gap-4">
        <Icon className="mt-1 h-10 w-10 shrink-0" />
        <div>
          <h3 className="text-[18px] leading-tight font-bold">{title}</h3>
          <p className="mt-7 text-[10px] font-semibold md:text-[22px]">{mainValue}</p>
          <p className="mt-3 text-[17px] text-white/80">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

function getCardStyles(type, status) {
  if (type === 'success') {
    return {
      bg: status === 'warning' ? 'bg-[#F59E0B]' : 'bg-[#2FC36A]',
      icon: CheckCircle2,
    }
  }

  if (type === 'danger') {
    return {
      bg: 'bg-[#FF234F]',
      icon: AlertCircle,
    }
  }

  return {
    bg: 'bg-[#3B82F6]',
    icon: Info,
  }
}
