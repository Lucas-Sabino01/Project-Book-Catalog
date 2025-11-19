const express = require('express');
const router = express.Router();
const bookController = require('../controllers/BookController');
const authMiddleware = require('../middlewares/authMiddleware').auth;

router.post("/", authMiddleware, bookController.create);
router.get("/", bookController.findAll);
router.get("/:id", bookController.findOne);
router.put("/:id", authMiddleware, bookController.update);
router.delete("/:id", authMiddleware, bookController.delete);

module.exports = router;