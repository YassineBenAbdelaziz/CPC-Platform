const express = require('express');
const router = express.Router();

const {isAuth, checkRole} = require('../middlewares/authMiddlewares');
const ExampleController = require("../Controllers/example");

router.get('/', ExampleController.get_all);

router.post('/', isAuth, checkRole(['mod','admin']) , ExampleController.create_example);

router.get('/:exampleId', ExampleController.get_example);

router.get('/findByProblem/:problemId', ExampleController.get_examples_by_problem);

router.patch('/:exampleId', isAuth, checkRole(['mod','admin']) , ExampleController.update_example);

router.delete('/:exampleId', isAuth, checkRole(['mod','admin']) , ExampleController.delete_example);

module.exports = router; 