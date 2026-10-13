const express = require("express");
const router = express.Router();
const { auth } = require('../middlewares/auth');
const PublicationController = require("../controllers/publication");
const subida = require('../middlewares/multer_config');

//Definir rutas
router.post("/publicacion", [auth, subida.single("file0")], PublicationController.publicacion);
router.get("/feed", auth, PublicationController.feed);
//exportar router

module.exports = router;