import Productos from "../models/Productos.js";


export const crearProducto = async (req, res) => {
    try {
        const { productId, Nombre, Descripcion, Precio, Image } = req.body;

        const newProduct = new Productos({
            productId,
            Nombre,
            Descripcion,
            Precio,
            Image
        });

        await newProduct.save();

        res.status(201).json({ message: "Producto guardado con éxito" });

    } catch (error) {
        console.error("Error al guardar el producto", error);
        res.status(400).json({
            message: "Error al ingresar el producto"
        });
    }
};



export const obtenerProductos = async (req, res) => {
    try {
        const listarProductos = await Productos.find();
        res.status(200).json(listarProductos);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener los productos" });
    }
};



export const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const productoActualizado = await Productos.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json({ message: "Producto actualizado", productoActualizado });

    } catch (error) {
        res.status(400).json({ message: "Error al actualizar producto" });
    }
};



export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const productoEliminado = await Productos.findByIdAndDelete(id);

        if (!productoEliminado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json({ message: "Producto eliminado correctamente" });

    } catch (error) {
        res.status(400).json({ message: "Error al eliminar producto" });
    }
};
