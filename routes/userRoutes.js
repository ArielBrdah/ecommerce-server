const express = require('express');
const { hasValidToken, authorized } = require('../middlewares/authorizations');
const {UsersController} = require('../controllers/UsersController')


const router = express.Router();

router.post('/register', UsersController.register);
router.delete('/:uuid/remove', hasValidToken, authorized('admin'), UsersController.remove)
router.put('/:uuid/update', hasValidToken, UsersController.update)
router.get('/all', hasValidToken, authorized('admin'), UsersController.all)

module.exports = router;
