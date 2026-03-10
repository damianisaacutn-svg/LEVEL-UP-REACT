export default function MetricCard({ title, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <p className="text-sm text-gray-500">{title}</p>

      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}
