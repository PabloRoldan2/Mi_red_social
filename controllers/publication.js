const Publication = require('../models/publication');

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
            newPublication.file = req.file.filename; // O 'image', dependiendo de cómo lo tengas en tu esquema para la foto
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

        return res.status(200).json({
            status: "success",
            publicaciones
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
