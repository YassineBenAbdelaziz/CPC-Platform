const { models } = require('../sequelize');


exports.get_all = (req, res, next) => {
    models.example.findAll()
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}


exports.get_examples_by_problem = (req, res, next) => {
    models.example.findAll({
        where: {
            problemIdProblem: req.params.problemId
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


exports.create_example = (req, res, next) => {
    const example = {
        input: req.body.input,
        output: req.body.output,
        id_problem: req.body.id_problem
    }

    models.example.create(example)
        .then(res.status(201).json({
            message: "Example Created",
            example: example
        }))
        .catch(err => {
            res.status(500).json({ error: err });
        });
}


exports.get_example = (req, res, next) => {
    const id = req.params.exampleId;
    models.example.findByPk(id)
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
    try {
        const id = req.params.exampleId;

        const example = await models.example.findByPk(id);
        if (!example) {
            return res.status(404).json({
                message: "Example NOT FOUND"
            });
        }
        const exampleBody = {
            input: req.body.input,
            output: req.body.output
        }

        await models.example.update(exampleBody, { where: { id_example: id } });
        return res.status(200).json({
            message: "Updated example with id : " + id
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}


exports.delete_example = async (req, res, next) => {
    try {
        const id = req.params.exampleId;
        const example = await models.example.findByPk(id)
        if (!example) {
            return res.status(404).json({
                message: "example NOT FOUND"
            });
        }
        await models.example.destroy({ where: { id_example: id } })
        return res.status(200).json({
            message: "Deleted example with id : " + id
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}