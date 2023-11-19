const express = require('express');
const router = express.Router();

const {isAuth, checkRole} = require('../middlewares/authMiddlewares');
const TagController = require("../Controllers/tag");

router.get('/', TagController.get_all);

router.get('/count', TagController.countByTag);

router.post('/', isAuth, checkRole(['mod','admin']) , TagController.create_tag);

router.get('/:tagId', TagController.get_tag);

router.get('/findByProblem/:problemId', TagController.get_tags_by_problem);

router.patch('/:tagId',isAuth, checkRole(['mod','admin']) , TagController.update_tag);

router.delete('/:tagId', isAuth, checkRole(['mod','admin']) , TagController.delete_tag);

module.exports = router; 