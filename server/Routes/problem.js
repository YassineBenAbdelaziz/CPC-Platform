const express = require('express');
const router = express.Router();
const {isAuth, checkRole} = require('../middlewares/authMiddlewares');

const ProblemController = require("../Controllers/problem");


router.get('/', ProblemController.get_all);

router.post('/problemPage', ProblemController.getPage);

router.post('/create', ProblemController.create_problem);

router.post('/:problemId/add-tag', ProblemController.add_tag);

router.get('/:problemId', ProblemController.get_problem);

router.get('/findByContest/:contestId', ProblemController.get_problems_by_contest);

router.patch('/:problemId', isAuth, checkRole(['mod','admin']) , ProblemController.update_problem);

router.delete('/:problemId', isAuth, checkRole(['mod','admin']),  ProblemController.delete_problem);

module.exports = router; 