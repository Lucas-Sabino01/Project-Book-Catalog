const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware").auth;
const adminMiddleware = require("../middlewares/adminMiddleware").isAdmin;

router.post("/user/auth", authController.create);
router.post("/user/auth/login", authController.login);
router.get("/user", [authMiddleware, adminMiddleware], userController.getAll);
router.get(
  "/user/:id",
  [authMiddleware, adminMiddleware],
  userController.getById
);
router.put("/user/:id", authMiddleware, userController.update);
router.delete(
  "/user/:id",
  [authMiddleware, adminMiddleware],
  userController.delete
);

module.exports = router;
