const express = require("express");
const router = express.Router();
const LikeController = require("../controllers/like");
const { auth } = require('../middlewares/auth');

// Ruta para dar o quitar like
router.post("/like/:publicationId", auth, LikeController.toggleLike);

module.exports = router;