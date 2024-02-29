const express = require('express');
const router = express.Router();
const {isAuth, checkRole} = require('../middlewares/authMiddlewares');

const ProblemController = require("../Controllers/problem");


router.get('/', ProblemController.get_all);

router.post('/', isAuth, checkRole(['mod','admin']) , ProblemController.create_problem);

router.post('/problemPage', ProblemController.getPage);

router.get('/problemStatus/:problemId', isAuth,  ProblemController.get_problem_status);

router.post('/:problemId/add-tag', isAuth, checkRole(['mod','admin']) , ProblemController.add_tag);

router.get('/:problemId', ProblemController.get_problem);

router.get('/findByContest/:contestId', ProblemController.get_problems_by_contest);

router.patch('/:problemId', isAuth, checkRole(['mod','admin']) , ProblemController.update_problem);

router.delete('/:problemId', isAuth, checkRole(['mod','admin']),  ProblemController.delete_problem);

module.exports = router; 