// components/productos/ProductosGrid.jsx

import ProductCard from "./ProductCard.jsx";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-3.5 bg-gray-200 rounded-full animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-3 bg-gray-200 rounded-full animate-pulse w-4/5" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 bg-gray-200 rounded-full animate-pulse w-16" />
          <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-24" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <span className="text-6xl mb-4">🔍</span>
      <p className="font-semibold text-gray-600 text-lg mb-2">
        No encontramos productos
      </p>
      <p className="text-gray-400 text-sm">
        Prueba ajustando los filtros de búsqueda
      </p>
    </div>
  );
}

export default function ProductosGrid({ productos, loading, addedId, onAgregar }) {
  return (
    <>
      {/* Contador */}
      {!loading && productos.length > 0 && (
        <p className="text-gray-400 text-sm mb-5">
          {productos.length} producto{productos.length !== 1 ? "s" : ""} encontrado
          {productos.length !== 1 ? "s" : ""}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {loading ? (
          [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
        ) : productos.length === 0 ? (
          <EmptyState />
        ) : (
          productos.map((prod) => (
            <ProductCard
              key={prod._id}
              prod={prod}
              onAgregar={onAgregar}
              added={addedId === prod._id}
            />
          ))
        )}
      </div>
    </>
  );
}