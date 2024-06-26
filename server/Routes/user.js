const controller = require('../Controllers/user');
const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multerMiddleware');
const passport = require('passport');
const {isAuth, checkRole} = require('../middlewares/authMiddlewares');

router.get('/', controller.getAll);

router.get('/profile/:username', controller.getUserProfile);

router.get('/current', controller.getCurrentUser);

router.post('/register', controller.register);

router.post('/login', passport.authenticate('local'), controller.login);

router.get('/logout', controller.logout);

router.patch('/', isAuth, checkRole(['admin']) , controller.editRole);

router.delete('/:id', isAuth, checkRole(['admin']) , controller.deleteUser);

router.patch('/:id', isAuth, multer, controller.updateUser);


module.exports = router;