import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Send, Loader2, KeyRound, Shield } from "lucide-react";
import axios from "axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await axios.post(
                "http://localhost:8081/api/Recuperar/solicitar-codigo",
                { Correo_Electronico: email }
            );

            setMessage({
                type: "success",
                text: response.data.message || "Código enviado a tu correo electrónico",
            });

            // Redirigir al componente de verificación después de 2 segundos
            setTimeout(() => {
                navigate("/verify-code", { state: { email } });
            }, 2000);
        } catch (error) {
            console.error("Error:", error);
            setMessage({
                type: "error",
                text:
                    error.response?.data?.message ||
                    "Error al enviar el código de recuperación",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-blue-50 via-white to-purple-50">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                            <KeyRound className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Recuperar Contraseña
                        </h2>
                        <p className="text-gray-600">
                            Ingresa tu correo y te enviaremos un código de verificación
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="recovery-email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                <Mail className="w-4 h-4 inline mr-2 text-gray-400" />
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                id="recovery-email"
                                placeholder="tu@email.com"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                                required
                            />
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
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
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

                        {/* Botón Enviar */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Enviando código...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    ENVIAR CÓDIGO
                                </>
                            )}
                        </button>
                    </form>

                    {/* Volver al Login */}
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors inline-flex items-center"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Volver al inicio de sesión
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p className="flex items-center justify-center">
                        <Shield className="w-4 h-4 mr-1" />
                        El código expirará en 15 minutos
                    </p>
                </div>
            </div>
        </main>
    );
}
