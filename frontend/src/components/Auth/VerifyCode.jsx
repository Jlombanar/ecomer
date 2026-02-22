import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck,Lock, Eye,EyeOff,Loader2,ArrowLeft,CheckCircle,Shield} from "lucide-react";
import axios from "axios";

export default function VerifyCode() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const inputsRef = useRef([]);

    // Redirigir si no hay email
    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    // Manejar cambio en inputs del código OTP
    function handleCodeChange(index, value) {
        // Solo permitir dígitos
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus al siguiente input
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    }

    // Manejar tecla Backspace
    function handleKeyDown(index, e) {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    }

    // Manejar pegado del código completo
    function handlePaste(e) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split("");
            setCode(digits);
            inputsRef.current[5]?.focus();
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        const codigoCompleto = code.join("");

        // Validaciones
        if (codigoCompleto.length !== 6) {
            return setMessage({
                type: "error",
                text: "Debes ingresar el código completo de 6 dígitos",
            });
        }

        if (newPassword.length < 6) {
            return setMessage({
                type: "error",
                text: "La contraseña debe tener al menos 6 caracteres",
            });
        }

        if (newPassword !== confirmPassword) {
            return setMessage({
                type: "error",
                text: "Las contraseñas no coinciden",
            });
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:8081/api/Recuperar/cambiar-password",
                {
                    Correo_Electronico: email,
                    codigo: codigoCompleto,
                    nuevaPassword: newPassword,
                }
            );

            setMessage({
                type: "success",
                text:
                    response.data.message || "¡Contraseña actualizada exitosamente!",
            });

            // Redirigir al login después de 2.5 segundos
            setTimeout(() => {
                navigate("/login");
            }, 2500);
        } catch (error) {
            console.error("Error:", error);
            setMessage({
                type: "error",
                text:
                    error.response?.data?.message ||
                    "Error al cambiar la contraseña",
            });
        } finally {
            setLoading(false);
        }
    }

    if (!email) return null;

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-blue-50 via-white to-purple-50">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Código de Verificación
                        </h2>
                        <p className="text-gray-600">
                            Ingresa el código enviado a
                        </p>
                        <p className="text-blue-600 font-semibold text-sm mt-1">
                            {email}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Código OTP — 6 inputs */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                Código de 6 dígitos
                            </label>
                            <div className="flex justify-center gap-2" onPaste={handlePaste}>
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputsRef.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Nueva Contraseña */}
                        <div>
                            <label
                                htmlFor="new-password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                <Lock className="w-4 h-4 inline mr-2 text-gray-400" />
                                Nueva contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="new-password"
                                    placeholder="Mínimo 6 caracteres"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    value={newPassword}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12 text-gray-900"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirmar Contraseña */}
                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                <Lock className="w-4 h-4 inline mr-2 text-gray-400" />
                                Confirmar contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    id="confirm-password"
                                    placeholder="Repite tu contraseña"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12 text-gray-900"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirm ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Mensajes */}
                        {message.text && (
                            <div
                                className={`p-4 rounded-lg ${message.type === "success"
                                        ? "bg-green-50 border border-green-200 text-green-800"
                                        : "bg-red-50 border border-red-200 text-red-800"
                                    }`}
                            >
                                <div className="flex items-center">
                                    {message.type === "success" ? (
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                    ) : (
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    )}
                                    <span>{message.text}</span>
                                </div>
                            </div>
                        )}

                        {/* Botón */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Cambiando contraseña...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    CAMBIAR CONTRASEÑA
                                </>
                            )}
                        </button>
                    </form>

                    {/* Volver */}
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors inline-flex items-center"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Reenviar código
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p className="flex items-center justify-center">
                        <Shield className="w-4 h-4 mr-1" />
                        Tu contraseña será encriptada de forma segura
                    </p>
                </div>
            </div>
        </main>
    );
}
