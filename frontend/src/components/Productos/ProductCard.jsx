// components/productos/ProductCard.jsx

export default function ProductCard({ prod, onAgregar, added }) {
  const precio = parseFloat(prod.Precio);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-default">

      {/* Imagen */}
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        {prod.Image && (
          <img
            src={prod.Image}
            alt={prod.Nombre}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}

        {!prod.Image && (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <span className="text-5xl">📦</span>
            <span className="text-xs text-gray-400">Sin imagen</span>
          </div>
        )}

        {/* Badge categoría */}
        {prod.Categoria && prod.Categoria !== "Otros" && (
          <span className="absolute top-2.5 left-2.5 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {prod.Categoria}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-1.5 truncate">
          {prod.Nombre || "Producto"}
        </h3>

        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2 min-h-10">
          {prod.Descripcion || "Sin descripción disponible."}
        </p>

        {/* Precio + botón */}
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-lg text-gray-900">
            ${isNaN(precio) ? "—" : precio.toFixed(2)}
          </span>

          <button
            onClick={() => onAgregar(prod)}
            className={`
              flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold
              text-white transition-all duration-150 active:scale-95
              ${added
                ? "bg-green-600"
                : "bg-indigo-600 hover:bg-indigo-700"
              }
            `}
          >
            {added ? "✓ Agregado" : "+ Carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}