import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Función para enviar correos electrónicos de confirmación de pedido
 * @param {Object} pedido - Objeto del pedido con datos del comprador y productos
 */
export const enviarConfirmacionPedido = async (pedido) => {
    try {
        const mailOptions = {
            from: `"TechStore Pro" <${process.env.EMAIL_USER}>`,
            to: pedido.comprador.correo,
            subject: `Confirmación de Pedido - TechStore Pro`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">¡Gracias por tu compra!</h1>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p>Hola <strong>${pedido.comprador.nombre}</strong>,</p>
                        <p>Tu pedido ha sido recibido con éxito y está siendo procesado.</p>
                        
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #4F46E5;">Detalles del Pedido:</h3>
                            <p style="margin: 5px 0;"><strong>ID del Pedido:</strong> ${pedido._id}</p>
                            <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date(pedido.fechaPedido).toLocaleDateString()}</p>
                            <p style="margin: 5px 0;"><strong>Total:</strong> $${pedido.total.toFixed(2)}</p>
                        </div>

                        <h3 style="border-bottom: 2px solid #f0f0f0; padding-bottom: 5px;">Productos:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="text-align: left; background-color: #f8f8f8;">
                                    <th style="padding: 10px; border-bottom: 1px solid #ddd;">Producto</th>
                                    <th style="padding: 10px; border-bottom: 1px solid #ddd;">Cant.</th>
                                    <th style="padding: 10px; border-bottom: 1px solid #ddd;">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${pedido.productos.map(item => `
                                    <tr>
                                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.nombre}</td>
                                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.cantidad}</td>
                                        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.precio.toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>

                        <div style="margin-top: 30px; padding: 15px; border-top: 1px solid #f0f0f0;">
                            <h3 style="margin-top: 0; color: #4F46E5;">Dirección de Envío:</h3>
                            <p style="margin: 5px 0;">${pedido.direccionEnvio.direccion}</p>
                            <p style="margin: 5px 0;">${pedido.direccionEnvio.ciudad}, ${pedido.direccionEnvio.departamento || ''}</p>
                            <p style="margin: 5px 0;">Teléfono: ${pedido.comprador.telefono}</p>
                        </div>
                    </div>
                    
                    <div style="background-color: #f0f0f0; padding: 15px; text-align: center; color: #777; font-size: 12px;">
                        <p>© 2025 TechStore Pro - Tu tienda de tecnología de confianza</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email de confirmación enviado a: ${pedido.comprador.correo}`);
    } catch (error) {
        console.error("Error al enviar email de confirmación:", error);
    }
};
