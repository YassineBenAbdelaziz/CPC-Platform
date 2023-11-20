const express = require('express');
const router = express.Router();

const {isAuth, checkRole} = require('../middlewares/authMiddlewares');
const SubmissionController = require("../Controllers/submission");

router.get('/', SubmissionController.get_all);

router.post('/', isAuth, checkRole(['mod','admin']) , SubmissionController.create_submission);

router.post('/findByProblem/:problemId', SubmissionController.get_submissions_by_problem);

router.post('/findByUser/:userId', SubmissionController.get_submissions_by_user);

router.post('/findByProblemAndUser/:problemId/:userId', isAuth, SubmissionController.get_submissions_by_problem_and_user);

router.get('/:submissionId', SubmissionController.get_submission);

module.exports = router; 