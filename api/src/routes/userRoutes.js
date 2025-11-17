const express = require('express');
const router = express.Router();

const authController = require("../controllers/authController")
const userController = require("../controllers/userController")

router.post('/user/auth', authController.create)
router.post('/user/auth/login', authController.login)
router.get('/user', userController.getAll);
router.get('/user/:id', userController.getById);
router.put('/user/:id', userController.update);
router.delete('/user/:id', userController.delete);

module.exports = router;
