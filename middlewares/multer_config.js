const multer = require('multer');

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Especificar la carpeta donde se guardarán los archivos subidos
        cb(null, './uploads/');
    },
    // Generar un nombre único para el archivo subido
    filename: (req, file, cb) => {
        cb(null, 'avatar-' + Date.now() + '-' + file.originalname);
    }
});

// Crear una instancia de multer con la configuración de almacenamiento
const upload = multer({ storage: storage });

module.exports = upload;