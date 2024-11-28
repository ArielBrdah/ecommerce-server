const express = require('express');
const {AuthController} = require('../controllers/AuthController');
const { hasValidToken } = require('../middlewares/authorizations');
const router = express.Router();

// Route de connexion
router.post('/login', AuthController.login);
router.post('/logout', hasValidToken, AuthController.logout);

module.exports = router