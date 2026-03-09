import NavbarAdmin from '../components/NavbarAdmin'

export default function AdminCategorias() {
  return (
    <>
      <NavbarAdmin />

      <div className="p-6">
        <h1 className="text-2xl font-bold">Gestión de Categorías</h1>

        <p className="text-gray-500 mt-2">
          Aquí el administrador podrá crear, editar o desactivar categorías.
        </p>
      </div>
    </>
  )
}
