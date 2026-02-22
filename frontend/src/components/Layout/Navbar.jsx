

import { useState } from "react";
import { ShoppingCart, User, Menu, X, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { usuario, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg mr-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TechStore Pro
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Inicio
            </Link>
            <Link to="/productos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Productos
            </Link>
            {/* Solo admin ve el enlace al panel */}
            {usuario?.rol === "admin" && (
              <Link to="/admin" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200 flex items-center gap-1">
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Área de usuario */}
          <div className="flex items-center space-x-2">

            {/* Carrito — visible para todos, navega a checkout */}
            <Link
              to="/checkout"
              className="relative group p-2.5 hover:bg-blue-50 rounded-xl transition-all duration-300"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Condicional: si hay usuario logueado muestra info, si no muestra Login */}
            {usuario ? (
              <div className="flex items-center gap-2">
                {/* Nombre del usuario */}
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-800">{usuario.nombre}</span>
                  <span className="text-xs text-gray-400 capitalize">{usuario.rol}</span>
                </div>

                {/* Botón cerrar sesión */}
                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="p-2.5 hover:bg-red-50 rounded-xl transition-all duration-300 group"
                >
                  <LogOut className="w-6 h-6 text-gray-700 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            ) : (
              /* Sin sesión → botón de Login */
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <User className="w-4 h-4" />
                Iniciar sesión
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/productos"
                className="text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                to="/checkout"
                className="text-gray-700 hover:text-blue-600 font-medium py-2 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-4 h-4" />
                Carrito {totalItems > 0 && `(${totalItems})`}
              </Link>
              {usuario?.rol === "admin" && (
                <Link
                  to="/admin"
                  className="text-purple-600 font-semibold py-2 flex items-center gap-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Panel Admin
                </Link>
              )}
              {usuario ? (
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="text-red-500 font-medium py-2 text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión ({usuario.nombre})
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;