const contest = require('../Entities/contest');
const controller = require('../Controllers/contest')
const express = require('express');
const router = express.Router();

router.get('/', controller.getContests);

router.get('/:id', controller.getContestById);

router.post('/add', controller.createContest);

router.delete('/:id', controller.deleteContest);

router.patch('/:id', controller.updateContest);


module.exports = router;