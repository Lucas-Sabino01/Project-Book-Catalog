const express = require("express");
const router = express.Router();
const bookController = require("../controllers/BookController");
const authMiddleware = require("../middlewares/authMiddleware").auth;
const adminMiddleware = require("../middlewares/adminMiddleware").isAdmin;

router.post("/", [authMiddleware, adminMiddleware], bookController.create);
router.get("/", bookController.findAll);
router.get("/stats", bookController.getStats);
router.get("/autores", bookController.getAuthors);
router.get("/:id", bookController.findOne);
router.put("/:id", [authMiddleware, adminMiddleware], bookController.update);
router.delete("/:id", [authMiddleware, adminMiddleware], bookController.delete);

module.exports = router;
