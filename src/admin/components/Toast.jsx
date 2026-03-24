export default function Toast({ message }) {
  return (
    <div className="fixed bottom-5 right-5 bg-[#2ECC71] text-white px-4 py-2 rounded-lg shadow-lg">
      {message}
    </div>
  )
}
