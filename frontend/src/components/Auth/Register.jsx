import { useState } from "react";
import { Eye, EyeOff, UserPlus, Shield, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      return setMessage({ type: "error", text: "Las contraseñas no coinciden" });
    }

    if (!formData.terms) {
      return setMessage({ type: "error", text: "Debes aceptar los términos" });
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8081/api/users/register",
        {
          Nombre: formData.nombre,
          Apellido: formData.apellido,
          telefono: formData.telefono,
          Correo_Electronico: formData.email,
          passwords: formData.password
        }
      );

      setMessage({
        type: "success",
        text: "Cuenta creada exitosamente"
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Error al registrar usuario"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Únete a TechStore Pro!
            </h2>
            <p className="text-gray-600">
              Crea tu cuenta y disfruta de ofertas exclusivas
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Nombre / Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
              <input
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Email */}
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            {/* Teléfono */}
            <input
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Terms */}
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />
              Acepto términos y condiciones
            </label>

            {/* Message */}
            {message.text && (
              <p className={`text-sm ${message.type === "error" ? "text-red-600" : "text-green-600"
                }`}>
                {message.text}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold flex justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Crear Cuenta"}
            </button>

            <p className="text-center">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 font-semibold"
              >
                Inicia sesión aquí
              </button>
            </p>

          </form>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600 flex justify-center gap-2">
          <Shield className="w-4 h-4" />
          Tu información está protegida
        </div>
      </div>
    </main>
  );
}
