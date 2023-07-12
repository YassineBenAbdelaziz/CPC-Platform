const express = require('express');
const router = express.Router();

// const problem = require('../Entities/problem');
const ProblemController = require("../Controllers/problem");

router.get('/', ProblemController.get_all);

router.post('/', ProblemController.create_problem);

router.get('/:problemId', ProblemController.get_problem);

router.patch('/:problemId', ProblemController.update_problem);

router.delete('/:problemId', ProblemController.delete_problem);

module.exports = router; 