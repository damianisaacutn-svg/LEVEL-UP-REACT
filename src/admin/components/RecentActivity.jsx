export default function RecentActivity({ data }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-6">Actividad reciente</h2>

      <div className="space-y-4">
        {data.map(item => (
          <div key={item.id} className="border-b pb-3">
            <p className="text-sm font-medium">{item.action}</p>

            <p className="text-xs text-gray-400">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
