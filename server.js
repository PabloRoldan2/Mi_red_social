const express = require("express");
const connection = require("./database/connection"); // Tu conexión a la base de datos
const cors = require("cors");

// 1. Inicializar el servidor Express
const app = express();
const puerto = 3900; // El puerto al que Postman intenta conectarse

// 2. Conectar a la base de datos de MongoDB
connection();

// 3. Configurar middlewares (para que Express entienda JSON y datos de formularios)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Cargar las rutas 
const UserRoutes = require("./routes/user");
const PublicationRoutes = require("./routes/publication");

// Prefijo para las rutas (por ejemplo: /api/user/register, /api/user/prueba, etc.)
app.use("/api", UserRoutes);
app.use("/api", PublicationRoutes);

// Hacer que la carpeta "uploads" sea accesible públicamente para ser accesible por URL
app.use("/uploads", express.static("uploads"));

// 5. Poner a escuchar el servidor
app.listen(puerto, () => {
    console.log("Servidor de Node.js corriendo en el puerto: " + puerto);
});