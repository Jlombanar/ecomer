import express from "express";
import { verificarToken,  soloAdmin } from "../middlewares/authMiddleware.js";
import { obtenerProductos, crearProducto, actualizarProducto,  eliminarProducto 
} from "../controllers/Productos.js";

const router = express.Router();

// 👤 Ver productos (user y admin)
router.get("/",  obtenerProductos);

// 👑 Crear
router.post("/", verificarToken, soloAdmin, crearProducto);

// 👑 Actualizar
router.put("/:id", verificarToken, soloAdmin, actualizarProducto);

// 👑 Eliminar
router.delete("/:id", verificarToken, soloAdmin, eliminarProducto);

export default router;
