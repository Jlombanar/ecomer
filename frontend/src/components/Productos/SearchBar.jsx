// components/productos/SearchBar.jsx

export default function SearchBar({ busqueda, onChange }) {
  return (
    <div className="relative mb-5">
      {/* Ícono lupa */}
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        type="text"
        value={busqueda}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar productos..."
        className="
          w-full pl-11 pr-4 py-3.5
          border border-gray-200 rounded-xl
          text-sm text-gray-900 placeholder-gray-400
          bg-white outline-none
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
          transition-all duration-200
        "
      />
    </div>
  );
}