const express = require('express');
const { isAuth } = require('../middlewares/authMiddlewares');
const router = express.Router();

const SubmissionController = require("../Controllers/submission");

router.get('/', SubmissionController.get_all);

router.post('/', SubmissionController.create_submission);

router.post('/findByProblem/:problemId', SubmissionController.get_submissions_by_problem);

router.post('/findByUser/:userId', SubmissionController.get_submissions_by_user);

router.post('/findByProblemAndUser/:problemId/:userId', isAuth, SubmissionController.get_submissions_by_problem_and_user);

router.get('/:submissionId', SubmissionController.get_submission);

module.exports = router; 