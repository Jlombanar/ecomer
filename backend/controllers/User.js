import Users from "../models/User.js";
import bcrypt from "bcrypt";

export const registrarUsers = async (req, res) => {
    try {
        const { Nombre, Apellido, telefono, Correo_Electronico, passwords } = req.body;

        // Validar campos obligatorios
        if (!Nombre || !Apellido || !telefono || !Correo_Electronico || !passwords) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Verificar si ya existe
        const existeUsuario = await Users.findOne({ Correo_Electronico });
        if (existeUsuario) {
            return res.status(400).json({ message: "Usuario ya está registrado" });
        }

        // Encriptar contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(passwords, saltRounds);

        // Crear usuario con rol fijo
        const nuevoUsuario = new Users({
            Nombre,
            Apellido,
            telefono,
            Correo_Electronico,
            passwords: hashedPassword,
            rol: "user" 
        });

        await nuevoUsuario.save();

        res.status(201).json({ message: "Usuario registrado con éxito" });

    } catch (error) {
        res.status(500).json({
            message: "Error al registrar usuario",
            error: error.message
        });
    }
};
