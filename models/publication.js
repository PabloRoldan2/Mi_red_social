const { Schema, model } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const publicationSchema = new Schema({
    // 1. Añadimos el campo user para saber quién hizo el post
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    // 2. Coincide con el texto que envías desde el formulario
    text: {
        type: String,
        required: true
    },
    // 3. Archivo/imagen opcional
    file: {
        type: String,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Agregar el plugin de paginación al esquema
publicationSchema.plugin(mongoosePaginate);

module.exports = model("Publication", publicationSchema, "publications");