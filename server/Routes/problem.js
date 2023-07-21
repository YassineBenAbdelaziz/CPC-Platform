const express = require('express');
const router = express.Router();

// const problem = require('../Entities/problem');
const ProblemController = require("../Controllers/problem");
const checkAuth = require("../middlewares/checkAuth");

router.get('/', ProblemController.get_all);

router.post('/problemPage', ProblemController.getPage);

router.post('/create', ProblemController.create_problem);

router.post('/:problemId/add-tag', ProblemController.add_tag);

router.get('/:problemId', ProblemController.get_problem);

router.get('/findByContest/:contestId', ProblemController.get_problems_by_contest);

router.patch('/:problemId', checkAuth, ProblemController.update_problem);

router.delete('/:problemId', checkAuth, ProblemController.delete_problem);

module.exports = router; 