const controller = require('../Controllers/user');
const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multerMiddleware');
const passport = require('passport');
const {isAuth} = require('../middlewares/authMiddlewares');

router.get('/',  controller.getAll);

router.post('/register', controller.register);

router.post('/login', passport.authenticate('local'), controller.login);

router.get('/logout', controller.logout );

router.delete('/:id', controller.deleteUser);

router.patch('/:id', multer, controller.updateUser);


module.exports = router;