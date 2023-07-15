const express = require('express');
const router = express.Router();

const ExampleController = require("../Controllers/example");

router.get('/', ExampleController.get_all);

router.post('/', ExampleController.create_example);

router.get('/:exampleId', ExampleController.get_example);

router.get('/findByProblem/:problemId', ExampleController.get_examples_by_problem);

router.patch('/:exampleId', ExampleController.update_example);

router.delete('/:exampleId', ExampleController.delete_example);

module.exports = router; 