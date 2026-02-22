import express from "express";
import { verificarToken, soloAdmin } from "../middlewares/authMiddleware.js";
import Users from "../models/User.js";

const router = express.Router();

router.get("/dashboard", verificarToken, soloAdmin, (req, res) => {
    res.json({
        message: "✅ Bienvenido al panel de administrador",
        admin: {
            nombre: req.usuario.Nombre,
            email: req.usuario.Correo_Electronico,
            rol: req.usuario.rol
        }
    });
});

// Obtener todos los usuarios registrados (solo admin)
router.get("/usuarios", verificarToken, soloAdmin, async (req, res) => {
    try {
        const usuarios = await Users.find().select("-passwords -codigoRecuperacion -codigoExpiracion");
        res.json({
            total: usuarios.length,
            usuarios
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
    }
});

export default router;