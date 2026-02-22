// routes/admin.js - VERSIÓN MÍNIMA
import express from "express";
import { verificarToken, soloAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Ruta de prueba protegida solo para admin
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

export default router;