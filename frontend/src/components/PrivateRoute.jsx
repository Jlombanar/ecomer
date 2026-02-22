
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, rolRequerido }) => {
  const { usuario } = useAuth();

  // Sin sesión → login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Rol incorrecto → redirige a su área
  if (rolRequerido && usuario.rol !== rolRequerido) {
    return usuario.rol === "admin"
      ? <Navigate to="/admin" replace />
      : <Navigate to="/productos" replace />;
  }

  return children;
};

export default PrivateRoute;