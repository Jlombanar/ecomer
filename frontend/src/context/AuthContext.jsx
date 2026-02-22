

import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ Inicializar desde localStorage para persistir la sesión
  const [usuario, setUsuario] = useState(() => {
    try {
      const stored = localStorage.getItem("usuario");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  const login = async (correo, password) => {
    const response = await axios.post("http://localhost:8081/api/login", {
      Correo_Electronico: correo,
      passwords: password,
    });

    const data = response.data;

    const usuarioConToken = {
      ...data.usuario,
      token: data.token,
    };

    // ✅ Guardar en estado Y en localStorage
    setUsuario(usuarioConToken);
    localStorage.setItem("usuario", JSON.stringify(usuarioConToken));

    // Redirigir según el rol
    if (data.usuario.rol === "admin") {
      navigate("/admin");
    } else {
      navigate("/productos");
    }
  };

  const logout = () => {
    setUsuario(null);
    // ✅ Limpiar localStorage al salir
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};