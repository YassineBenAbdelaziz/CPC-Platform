const express = require('express');
const router = express.Router();

const {isAuth, checkRole} = require('../middlewares/authMiddlewares');
const SubmissionController = require("../Controllers/submission");

router.get('/', SubmissionController.get_all);

router.post('/', isAuth, checkRole(['mod','admin']) , SubmissionController.create_submission);

router.get('/:submissionId', SubmissionController.get_submission);

module.exports = router; 