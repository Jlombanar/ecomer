import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  // Datos del comprador
  comprador: {
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
  },
  direccionEnvio: {
    direccion: { type: String, required: true },
    ciudad: { type: String, required: true },
    departamento: String,
    codigoPostal: String,
  },
  productos: [{
    productoId: { type: String, required: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true, default: 1 },
    imagen: String,
  }],
  total: { type: Number, required: true },
  estado: {
    type: String,
    enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente',
  },
  metodoPago: { type: String, default: 'contraentrega' },
  fechaPedido: { type: Date, default: Date.now },
});

export default mongoose.model('Pedido', pedidoSchema);