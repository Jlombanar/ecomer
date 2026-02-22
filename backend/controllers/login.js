import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/User.js";

export const LoginUsuario = async (req, res) => {
    try {
        const { Correo_Electronico, passwords } = req.body;

        // Validamos que los campos estén presentes
        if (!Correo_Electronico || !passwords) {
            return res.status(400).json({ message: "Correo y contraseña obligatorios" });
        }

        // Buscamos el usuario en la base de datos
        const usuario = await Users.findOne({ Correo_Electronico });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Comparamos la contraseña encriptada
        const passwordsValida = await bcrypt.compare(passwords, usuario.passwords);
        if (!passwordsValida) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generamos el token JWT con el rol incluido
        const token = jwt.sign(
            {
                id: usuario._id,
                rol: usuario.rol,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Respondemos con el token y los datos del usuario
        res.status(200).json({
            message: "Inicio de sesión correcto",
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.Nombre,
                apellido: usuario.Apellido,
                email: usuario.Correo_Electronico,
                telefono: usuario.telefono,
                rol: usuario.rol,
            },
        });

    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
};