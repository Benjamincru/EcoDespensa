const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
    },
    categoria: {
        type: String,
        enum: ['Lácteos', 'Frutas/Verduras', 'Cárnicos', 'Despensa', 'Otros'],
        default: 'Otros',
    },
    fechaCaducidad: {
        type: Date,
        required: [true, 'La fecha de vencimiento es obligatoria'],
    },
    cantidad: {
        type: Number,
        default: 1,
    },
    unidad: {
        type: String,
        default: 'piezas',
    },
    propietario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);