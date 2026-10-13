const Publication = require('../models/publication');
const Like = require('../models/like'); // 👈 1. Importamos el modelo Like

const publicacion = async (req, res) => {
    try {
        const params = req.body;

        // Si no mandó texto ni imagen, error
        if (!params.text && !req.file) {
            return res.status(400).json({
                status: "error",
                message: "Debes enviar un texto o una imagen"
            });
        }

        // Creamos el objeto de la publicación
        let newPublication = new Publication();
        newPublication.user = req.user.id; // ID del usuario autenticado
        
        // Si mandó texto, lo asociamos
        if (params.text) {
            newPublication.text = params.text;
        }

        // Si Multer guardó una imagen, la asociamos
        if (req.file) {
            newPublication.file = req.file.filename; 
        }

        // Guardamos en MongoDB
        const publicationStored = await newPublication.save();

        return res.status(200).json({
            status: "success",
            message: "¡Publicación guardada!",
            publication: publicationStored
        });

    } catch (error) {
        console.error("Error detallado al guardar:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al guardar la publicación"
        });
    }
};

const feed = async (req, res) => {
    try {
        const publicaciones = await Publication.find({})
            .sort({ created_at: -1 })
            .populate('user', 'name surname nick');

        // 👇 2. Enriquecemos cada publicación con el total de likes y si el usuario actual ya dio like
        const publicacionesConLikes = await Promise.all(publicaciones.map(async (pub) => {
            const totalLikes = await Like.countDocuments({ publication: pub._id });
            const miLike = await Like.findOne({ user: req.user.id, publication: pub._id });

            return {
                ...pub.toObject(),
                totalLikes,
                likedByMe: miLike ? true : false
            };
        }));

        return res.status(200).json({
            status: "success",
            publicaciones: publicacionesConLikes // 👈 3. Devolvemos la lista modificada
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al listar publicaciones"
        });
    }
};

module.exports = {
    publicacion,
    feed
};