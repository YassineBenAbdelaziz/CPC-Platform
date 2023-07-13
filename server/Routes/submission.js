const express = require('express');
const router = express.Router();

const SubmissionController = require("../Controllers/submission");

router.get('/', SubmissionController.get_all);

router.post('/', SubmissionController.create_submission);

router.get('/:submissionId', SubmissionController.get_submission);

module.exports = router; 