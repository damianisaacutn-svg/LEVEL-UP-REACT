export default function ActivityStatCard({ label, value, valueColor = 'text-[#111827]' }) {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3">
      <p className="text-[14px] font-medium text-[#6B7280]">{label}</p>
      <p className={`mt-3 text-[36px] leading-none font-bold ${valueColor}`}>{value}</p>
    </div>
  )
}
