const controller = require('../Controllers/user');
const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multerMiddleware');

router.post('/signup', controller.createUser );

router.delete('/:id',controller.deleteUser);

router.patch('/:id',multer,controller.updateUser);


module.exports = router;