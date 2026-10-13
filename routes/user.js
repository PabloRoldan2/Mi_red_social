const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users");
// 1. Importar el middleware de autenticación
const { auth } = require('../middlewares/auth');
const subida = require('../middlewares/multer_config');

router.get("/pruebaUser", UserController.pruebaUser);
router.post("/register", UserController.register);
router.get("/list", UserController.list);
router.post("/login", UserController.login);
router.get("/profile", UserController.profile);
// 2. Proteger la ruta de actualización con el middleware de autenticación
router.put("/update", auth, UserController.update);
// 3. Proteger la ruta de subida de archivos con el middleware de autenticación
router.post("/upload", [auth, subida.single("file0")], UserController.upload);   

module.exports = router;