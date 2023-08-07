const express = require('express');
const router = express.Router();

const SubmissionController = require("../Controllers/submission");

router.get('/', SubmissionController.get_all);

router.post('/', SubmissionController.create_submission);

router.get('/findByProblem/:problemId', SubmissionController.get_submissions_by_problem);

router.get('/findByProblemAndUser/:problemId/:userId', SubmissionController.get_submissions_by_problem_and_user);

router.get('/:submissionId', SubmissionController.get_submission);

module.exports = router; 