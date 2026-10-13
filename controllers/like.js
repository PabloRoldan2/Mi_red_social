const Like = require("../models/like");

// Función para Dar o Quitar Like (Toggle)
const toggleLike = async (req, res) => {
    try {
        // Obtenemos el ID del usuario autenticado (gracias a tu middleware de token)
        const userId = req.user.id;
        // Obtenemos el ID de la publicación desde los parámetros de la URL
        const publicationId = req.params.publicationId;

        // 1. Verificamos si el like ya existe en la base de datos
        const likeExistente = await Like.findOne({ user: userId, publication: publicationId });

        if (likeExistente) {
            // Si ya existe, significa que el usuario quiere quitar el like (Dislike / Unlike)
            await Like.findByIdAndDelete(likeExistente._id);

            // Contamos cuántos likes le quedan a la publicación
            const totalLikes = await Like.countDocuments({ publication: publicationId });

            return res.status(200).send({
                status: "success",
                message: "Like eliminado correctamente",
                liked: false,
                totalLikes
            });
        } else {
            // Si no existe, lo creamos (el usuario da like)
            const nuevoLike = new Like({
                user: userId,
                publication: publicationId
            });

            const likeAlmacenado = await nuevoLike.save();

            if (!likeAlmacenado) {
                return res.status(500).send({ status: "error", message: "No se ha podido guardar el like" });
            }

            // Contamos cuántos likes tiene ahora la publicación
            const totalLikes = await Like.countDocuments({ publication: publicationId });

            return res.status(200).send({
                status: "success",
                message: "Like registrado correctamente",
                liked: true,
                totalLikes
            });
        }

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error en el servidor al procesar el like",
            error: error.message
        });
    }
};

module.exports = {
    toggleLike
};