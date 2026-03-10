export default function PendingContentTable({ data }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-6">Contenido pendiente de aprobación</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Curso</th>
            <th>Instructor</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {data.map(item => (
            <tr key={item.id} className="border-b">
              <td className="py-2">{item.titulo}</td>
              <td>{item.instructor}</td>
              <td className="text-yellow-600">Pendiente</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
