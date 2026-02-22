// src/pages/Productos.jsx

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import SearchBar from "../Productos/SearchBar";
import FiltrosProductos, { RANGOS_PRECIO } from "../Productos/FiltrosProductos";
import ProductosGrid from "../Productos/ProductosGrid";

const API_URL = "http://localhost:8081/api/productos";

export default function ProductosPage() {
  const { usuario, logout } = useAuth();
  const { carrito, agregarAlCarrito, eliminarDelCarrito, totalItems, totalPrecio } = useCart();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas las categorías");
  const [rangoPrecio, setRangoPrecio] = useState(0);
  const [orden, setOrden] = useState("relevancia");

  // Carrito panel
  const [cartOpen, setCartOpen] = useState(false);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    fetchProductos();
    const interval = setInterval(fetchProductos, 30_000);
    return () => clearInterval(interval);
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error();
      setProductos(await res.json());
    } catch {
      /* silencioso */
    } finally {
      setLoading(false);
    }
  };

  // Filtrado + ordenamiento
  const rango = RANGOS_PRECIO[rangoPrecio];

  const productosFiltrados = productos
    .filter((p) => {
      const precio = parseFloat(p.Precio);
      const matchCat =
        categoria === "Todas las categorías" || p.Categoria === categoria;
      const matchMin = rango.min === null || precio >= rango.min;
      const matchMax = rango.max === null || precio <= rango.max;
      const matchBus =
        busqueda === "" ||
        p.Nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.Descripcion?.toLowerCase().includes(busqueda.toLowerCase());
      return matchCat && matchMin && matchMax && matchBus;
    })
    .sort((a, b) => {
      if (orden === "precio_asc") return parseFloat(a.Precio) - parseFloat(b.Precio);
      if (orden === "precio_desc") return parseFloat(b.Precio) - parseFloat(a.Precio);
      if (orden === "nombre_asc") return a.Nombre?.localeCompare(b.Nombre);
      if (orden === "nombre_desc") return b.Nombre?.localeCompare(a.Nombre);
      return 0;
    });

  // Agregar al carrito — requiere sesión
  const handleAgregarAlCarrito = (prod) => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    agregarAlCarrito(prod);
    setAddedId(prod._id);
    setTimeout(() => setAddedId(null), 1_200);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-linear-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <span className="font-bold text-indigo-600 text-lg tracking-tight">
              TechStore Pro
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {["Inicio", "Productos", "Categorías", "Contacto"].map((link, i) => (
              <Link
                key={link}
                to={i === 0 ? "/" : i === 1 ? "/productos" : "#"}
                className={`text-sm font-medium transition-colors duration-150
                  ${i === 1
                    ? "text-indigo-600 border-b-2 border-indigo-600 pb-0.5"
                    : "text-gray-600 hover:text-indigo-600"
                  }`}
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3">

            {/* Carrito */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Usuario o Login */}
            {usuario ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-800">{usuario.nombre}</span>
                  <span className="text-xs text-indigo-400 capitalize">{usuario.rol}</span>
                </div>
                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* BUSCADOR + FILTROS */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-7">
          <SearchBar busqueda={busqueda} onChange={setBusqueda} />
          <FiltrosProductos
            categoria={categoria} onCategoria={setCategoria}
            rangoPrecio={rangoPrecio} onRangoPrecio={setRangoPrecio}
            orden={orden} onOrden={setOrden}
          />
        </div>
      </div>

      {/* Aviso si no está logueado */}
      {!usuario && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl px-5 py-3 text-sm flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Puedes ver todos los productos. Para comprar,{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold underline hover:text-indigo-900"
            >
              inicia sesión
            </button>{" "}
            o{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-semibold underline hover:text-indigo-900"
            >
              crea una cuenta
            </button>.
          </div>
        </div>
      )}

      {/* GRID DE PRODUCTOS */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <ProductosGrid
          productos={productosFiltrados}
          loading={loading}
          addedId={addedId}
          onAgregar={handleAgregarAlCarrito}
        />
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-6 pt-14 pb-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
            <div className="col-span-2 md:col-span-1">
              <p className="text-white font-bold mb-3">TechStore Pro</p>
              <p className="text-sm leading-relaxed">
                Tu tienda de tecnología de confianza desde 2020.
              </p>
            </div>
            {[
              { title: "Enlaces", items: ["Inicio", "Productos", "Carrito"] },
              { title: "Atención", items: ["Contacto", "Envíos", "Devoluciones"] },
              { title: "Legal", items: ["Términos", "Privacidad"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-white font-semibold text-sm mb-4">{col.title}</p>
                {col.items.map((item) => (
                  <a key={item} href="#" className="block text-sm mb-2.5 hover:text-white transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs">
            © 2025 TechStore Pro. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* CARRITO PANEL (slide-out) */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-80 md:w-96 bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">🛒 Carrito ({totalItems})</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {carrito.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-16">
                  <span className="text-5xl mb-3">🛒</span>
                  <p className="font-semibold">El carrito está vacío</p>
                </div>
              ) : (
                carrito.map((item) => (
                  <div key={item._id} className="flex gap-3 pb-3 border-b border-gray-50">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {item.Image
                        ? <img src={item.Image} alt={item.Nombre} className="w-full h-full object-cover" />
                        : <div className="flex items-center justify-center h-full text-2xl">📦</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{item.Nombre}</p>
                      <p className="text-indigo-600 font-bold text-sm mt-0.5">
                        ${parseFloat(item.Precio).toFixed(2)} × {item.qty}
                      </p>
                    </div>
                    <button
                      onClick={() => eliminarDelCarrito(item._id)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium self-center"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
            {carrito.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="font-extrabold text-gray-900 text-lg">
                    ${totalPrecio.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setCartOpen(false);
                    navigate("/checkout");
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Proceder al pago →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}