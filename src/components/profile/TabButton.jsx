export default function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150
        ${active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
        }`}
    >
      <span className={`text-base ${active ? 'text-white' : 'text-gray-400'}`}>{icon}</span>
      {label}
    </button>
  );
}
