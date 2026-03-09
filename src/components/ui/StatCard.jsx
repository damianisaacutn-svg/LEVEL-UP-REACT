export default function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500">{title}</p>

      <h3 className="text-3xl font-bold mt-2 text-[#FF2D55]">{value}</h3>
    </div>
  )
}
