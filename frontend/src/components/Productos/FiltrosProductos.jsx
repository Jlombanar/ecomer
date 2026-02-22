// components/productos/FiltrosProductos.jsx

export const CATEGORIAS = [
  "Todas las categorías",
  "Electrónica",
  "Ropa",
  "Hogar",
  "Deportes",
  "Alimentos",
  "Juguetes",
  "Otros",
];

export const RANGOS_PRECIO = [
  { label: "Cualquier precio", min: null, max: null },
  { label: "Menos de $20",     min: 0,   max: 20   },
  { label: "$20 – $50",        min: 20,  max: 50   },
  { label: "$50 – $100",       min: 50,  max: 100  },
  { label: "$100 – $300",      min: 100, max: 300  },
  { label: "Más de $300",      min: 300, max: null },
];

export const ORDENAR = [
  { label: "Relevancia",            value: "relevancia"  },
  { label: "Precio: menor a mayor", value: "precio_asc"  },
  { label: "Precio: mayor a menor", value: "precio_desc" },
  { label: "Nombre A–Z",            value: "nombre_asc"  },
  { label: "Nombre Z–A",            value: "nombre_desc" },
];

// Select reutilizable
function FilterSelect({ label, value, onChange, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full appearance-none
            px-4 py-2.5 pr-10
            border border-gray-200 rounded-lg
            text-sm text-gray-800 bg-white
            outline-none cursor-pointer
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
            transition-all duration-200
          "
        >
          {children}
        </select>
        {/* Flecha */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

export default function FiltrosProductos({
  categoria,
  onCategoria,
  rangoPrecio,
  onRangoPrecio,
  orden,
  onOrden,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

      {/* Categoría */}
      <FilterSelect label="Categoría" value={categoria} onChange={onCategoria}>
        {CATEGORIAS.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </FilterSelect>

      {/* Rango de precio */}
      <FilterSelect
        label="Rango de Precio"
        value={rangoPrecio}
        onChange={(v) => onRangoPrecio(Number(v))}
      >
        {RANGOS_PRECIO.map((r, i) => (
          <option key={i} value={i}>
            {r.label}
          </option>
        ))}
      </FilterSelect>

      {/* Ordenar */}
      <FilterSelect label="Ordenar por" value={orden} onChange={onOrden}>
        {ORDENAR.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </FilterSelect>

    </div>
  );
}