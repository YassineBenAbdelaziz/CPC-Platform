const contest = require('../Entities/contest');
const controller = require('../Controllers/contest');
const {isAuth, checkRole} = require('../middlewares/authMiddlewares');
const express = require('express');
const router = express.Router();

router.get('/', controller.getContests);

router.get('/:id', controller.getContestById);

router.post('/add', isAuth, checkRole(['mod','admin']) , controller.createContest);

router.delete('/:id', isAuth, checkRole(['mod','admin']) , controller.deleteContest);

router.patch('/:id', isAuth, checkRole(['mod','admin']) , controller.updateContest);


module.exports = router;