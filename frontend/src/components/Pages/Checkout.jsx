import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function Checkout() {
    const { carrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito, totalItems, totalPrecio } = useCart();
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [procesando, setProcesando] = useState(false);
    const [pedidoExitoso, setPedidoExitoso] = useState(false);

    // Estado para los datos del comprador
    const [datosComprador, setDatosComprador] = useState({
        nombre: usuario?.nombre || "",
        correo: usuario?.Correo_Electronico || "",
        telefono: usuario?.telefono || "",
        direccion: "",
        ciudad: "",
        departamento: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDatosComprador(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleConfirmarPedido = async () => {
        if (!usuario) {
            navigate("/login");
            return;
        }

        // Validar datos del comprador
        if (!datosComprador.direccion || !datosComprador.ciudad || !datosComprador.telefono) {
            alert("Por favor completa los datos de envío (Dirección, Ciudad y Teléfono)");
            return;
        }

        setProcesando(true);
        try {
            const res = await fetch("http://localhost:8081/api/pedidos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${usuario?.token}`,
                },
                body: JSON.stringify({
                    userId: usuario._id || usuario.id,
                    comprador: {
                        nombre: datosComprador.nombre,
                        correo: datosComprador.correo,
                        telefono: datosComprador.telefono
                    },
                    direccionEnvio: {
                        direccion: datosComprador.direccion,
                        ciudad: datosComprador.ciudad,
                        departamento: datosComprador.departamento
                    },
                    productos: carrito.map((item) => ({
                        productoId: item._id,
                        nombre: item.Nombre,
                        precio: parseFloat(item.Precio),
                        cantidad: item.qty,
                        imagen: item.Image || "",
                    })),
                    total: totalPrecio,
                    metodoPago: 'contraentrega'
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Error al crear el pedido");
            }

            vaciarCarrito();
            setPedidoExitoso(true);
        } catch (err) {
            alert(err.message || "Error al procesar el pedido");
        } finally {
            setProcesando(false);
        }
    };

    // Pantalla de éxito
    if (pedidoExitoso) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Pedido confirmado!</h2>
                    <p className="text-gray-500 mb-8">
                        Tu pedido ha sido procesado exitosamente. Recibirás una confirmación pronto.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate("/productos")}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                        >
                            Seguir comprando
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition-colors"
                        >
                            Ir al inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* Header */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                            </svg>
                        </div>
                        <span className="font-bold text-indigo-600 text-lg tracking-tight">TechStore Pro</span>
                    </Link>
                    <Link
                        to="/productos"
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Volver a productos
                    </Link>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    Checkout
                    <span className="text-base font-normal text-gray-400">({totalItems} {totalItems === 1 ? "producto" : "productos"})</span>
                </h1>

                {carrito.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                        <span className="text-6xl mb-4 block">🛒</span>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h3>
                        <p className="text-gray-400 mb-6">Agrega productos desde nuestro catálogo</p>
                        <button
                            onClick={() => navigate("/productos")}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                        >
                            Ver productos
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Columna Izquierda: Datos y Productos */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Sección 1: Lista de productos */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <path d="M16 10a4 4 0 01-8 0" />
                                    </svg>
                                    Tus Productos
                                </h2>
                                {carrito.map((item) => {
                                    const precio = parseFloat(item.Precio);
                                    return (
                                        <div
                                            key={item._id}
                                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-5 items-center hover:shadow-md transition-shadow"
                                        >
                                            {/* Imagen */}
                                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                                {item.Image ? (
                                                    <img src={item.Image} alt={item.Nombre} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-3xl">📦</div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 truncate">{item.Nombre}</h3>
                                                <p className="text-sm text-gray-400 truncate mt-0.5">{item.Descripcion}</p>
                                                <p className="font-extrabold text-indigo-600 mt-1">
                                                    ${isNaN(precio) ? "—" : precio.toFixed(2)}
                                                </p>
                                            </div>

                                            {/* Controles de cantidad */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => actualizarCantidad(item._id, item.qty - 1)}
                                                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors font-bold"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center font-semibold text-gray-800">{item.qty}</span>
                                                <button
                                                    onClick={() => actualizarCantidad(item._id, item.qty + 1)}
                                                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Subtotal + eliminar */}
                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-gray-900">
                                                    ${(precio * item.qty).toFixed(2)}
                                                </p>
                                                <button
                                                    onClick={() => eliminarDelCarrito(item._id)}
                                                    className="text-xs text-red-400 hover:text-red-600 font-medium mt-1 transition-colors"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Sección 2: Datos del Comprador y Envío */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    Datos de Envío
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre Completo</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={datosComprador.nombre}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="Nombre de quien recibe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Teléfono de Contacto</label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            value={datosComprador.telefono}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="Ej: 300 123 4567"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email (Confirmación)</label>
                                        <input
                                            type="email"
                                            name="correo"
                                            value={datosComprador.correo}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="tu@email.com"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Dirección de Entrega</label>
                                        <input
                                            type="text"
                                            name="direccion"
                                            value={datosComprador.direccion}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="Calle, Carrera, Barrio, Apto/Casa"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Ciudad</label>
                                        <input
                                            type="text"
                                            name="ciudad"
                                            value={datosComprador.ciudad}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="Ej: Cali"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Departamento</label>
                                        <input
                                            type="text"
                                            name="departamento"
                                            value={datosComprador.departamento}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="Ej: Valle del Cauca"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Resumen */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                                <h3 className="font-bold text-gray-900 text-lg mb-5">Resumen del pedido</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal ({totalItems} productos)</span>
                                        <span className="font-semibold text-gray-800">${totalPrecio.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Envío</span>
                                        <span className="font-semibold text-green-600">Gratis</span>
                                    </div>
                                    <hr className="border-gray-100" />
                                    <div className="flex justify-between">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="font-extrabold text-xl text-gray-900">${totalPrecio.toFixed(2)}</span>
                                    </div>
                                </div>

                                {!usuario && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-700 flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                        Debes{" "}
                                        <button onClick={() => navigate("/login")} className="font-semibold underline">
                                            iniciar sesión
                                        </button>{" "}
                                        para confirmar.
                                    </div>
                                )}

                                <button
                                    onClick={handleConfirmarPedido}
                                    disabled={procesando}
                                    className={`w-full py-3.5 rounded-xl font-bold text-white transition-all text-sm ${procesando
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
                                        }`}
                                >
                                    {procesando ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="31.4 31.4" />
                                            </svg>
                                            Procesando...
                                        </span>
                                    ) : (
                                        "Confirmar pedido"
                                    )}
                                </button>

                                <button
                                    onClick={vaciarCarrito}
                                    className="w-full mt-3 py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl font-medium text-sm transition-colors"
                                >
                                    Vaciar carrito
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}
