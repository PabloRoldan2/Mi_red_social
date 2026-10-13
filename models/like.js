const { Schema, model } = require("mongoose");

const LikeSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    publication: {
        type: Schema.ObjectId,
        ref: "Publication",
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Opcional pero recomendado: Evita que un mismo usuario guarde múltiples likes duplicados para la misma publicación a nivel de base de datos
LikeSchema.index({ user: 1, publication: 1 }, { unique: true });

module.exports = model("Like", LikeSchema);