const { models } = require('../sequelize');


exports.get_all = async (req, res, next) => {
    await models.example.findAll()
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}


exports.get_examples_by_problem = async (req, res, next) => {
    await models.example.findAll({
        where: {
            id_problem: req.params.problemId
        }
    })
        .then(example => {
            if (!example) {
                return res.status(404).json({
                    message: "Example NOT FOUND"
                });
            } else {
                res.status(200).json(example);
            }
        }).catch(err => {
            res.status(500).json({ error: err });
        });
}


exports.create_example = async (req, res, next) => {
    const example = {
        input: req.body.input,
        output: req.body.output,
        id_problem: req.body.id_problem
    }

    await models.example.create(example)
        .then(res.status(201).json({
            message: "Example Created",
            example: example
        }))
        .catch(err => {
            res.status(500).json({ error: err });
        });
}


exports.get_example = async (req, res, next) => {
    const id = req.params.exampleId;
    await models.example.findByPk(id)
        .then(example => {
            if (!example) {
                return res.status(404).json({
                    message: "Example NOT FOUND"
                });
            } else {
                res.status(200).json(example);
            }
        }).catch(err => {
            res.status(500).json({ error: err });
        });
}


exports.update_example = async (req, res, next) => {
    const id = req.params.exampleId;

    await models.example.findByPk(id)
        .then(async example => {
            if (!example) {
                return res.status(404).json({
                    message: "Example NOT FOUND"
                });
            } else {
                const exampleBody = {
                    input: req.body.input,
                    output: req.body.output
                }

                await models.example.update(exampleBody, { where: { id_example: id } })
                    .then(() => {
                        res.status(200).json({
                            message: "Updated example with id : " + id
                        });
                    })
            }
        }).catch(err => {
            res.status(500).json({ error: err });
        });
}


exports.delete_example = async (req, res, next) => {
    const id = req.params.exampleId;
    await models.example.findByPk(id)
        .then(async example => {
            if (!example) {
                return res.status(404).json({
                    message: "example NOT FOUND"
                });
            } else {
                await models.example.destroy({ where: { id_example: id } })
                    .then(() => {
                        res.status(200).json({
                            message: "Deleted example with id : " + id
                        });
                    })
            }
        }).catch(err => {
            res.status(500).json({ error: err });
        });
}