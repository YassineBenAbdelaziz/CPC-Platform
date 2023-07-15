const controller = require('../Controllers/user');
const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multerMiddleware');

router.get('/', controller.getAll);

router.post('/signup', controller.createUser);

router.post('/login', controller.loginUser);

router.delete('/:id', controller.deleteUser);

router.patch('/:id', multer, controller.updateUser);


module.exports = router;