const { models } = require('../sequelize');
const { Op } = require("sequelize");

exports.get_all = (req, res, next) => {
    models.problem.findAll()
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            return res.status(500).json({ error: "There was an error, try again later"});
        });
}

exports.getPage = async (req, res, next) => {
    try {
        const params = []
        if (!req.body.page || !req.body.limit) {
            return res.status(404).json({
                error: "Missing params",
            })
        }
        const limit = parseInt(req.body.limit);
        const offset = (parseInt(req.body.page) - 1) * limit;

        const queryParams = {
            attributes: ["id_problem", "title", "score", "owner"],
            offset: offset,
            limit: limit,
            subQuery: false,
        }

        if (req.body.column && req.body.type) {
            params.push(req.body.column);
            params.push(req.body.type);
            queryParams.order = [params]
        }

        if (req.body.tags) {
            queryParams.include = [{
                model: models.tag,
                where: {
                    '$tags.tag$': {
                        [Op.in]: req.body.tags,
                    }
                },
                through: {
                    attributes: []
                }

            }]
        }

        const results = await models.problem.findAndCountAll(
            queryParams
        );

        if (req.user) {
            for(let problem of results.rows) {
                const userProblem = await models.user_problem.findOne({
                    where: {
                        id_problem: problem.dataValues.id_problem,
                        id_user: req.user.id_user
                    }
                });
                if (userProblem) {
                    problem.dataValues.status = userProblem.dataValues.status
                }
            }
        }

        return res.status(200).json({ ...results });
    }

    catch (err) {
        return res.status(500).json({ error: "There was an error, try again later"});
    }

}

exports.create_problem = async (req, res, next) => {
    const id_contest = req.body.id_contest ? req.body.id_contest : null;
    const attributes = {
        title: req.body.title,
        topic: req.body.topic,
        input: req.body.input,
        output: req.body.output,
        note: req.body.note,
        score: req.body.score,
        time_limit: req.body.time_limit,
        memory_limit: req.body.memory_limit,
        owner: req.user.username,
        test_file: req.body.test_file,
        solution: req.body.solution,
        tutorial: req.body.tutorial,
        checker: req.body.checker,
        status: req.body.status,
        id_contest: id_contest,
        examples: req.body.examples,
    }
    try {

        // Verify the existence of tag IDs before creating the problem
        const tags = await models.tag.findAll({ where: { id_tag: req.body.tags } });

        if (tags.length !== req.body.tags.length) {

            throw new Error(`Invalid tag IDs`);
        }

        const problem = await models.problem.create(attributes, { include: [models.example] });

        await problem.setTags(req.body.tags);

        return res.status(201).json(problem)
    }

    catch (err) {
        return res.status(500).json({ error: "There was an error, try again later"});
    };
}


exports.get_problem =  (req, res, next) => {
    const id = req.params.problemId;
    models.problem.findByPk(id)
        .then(problem => {
            if (!problem) {
                return res.status(404).json({
                    message: "Problem NOT FOUND"
                });
            } else {
                return res.status(200).json(problem);
            }
        }).catch(err => {
            return res.status(500).json({ error: "There was an error, try again later"});
        });
}


exports.get_problems_by_contest = (req, res, next) => {
    models.problem.findAll({
        where: {
            id_contest: req.params.contestId
        }
    })
        .then(problem => {
            if (!problem) {
                return res.status(404).json({
                    message: "Problem NOT FOUND"
                });
            } else {
                res.status(200).json(problem);
            }
        }).catch(err => {
            return res.status(500).json({ error: "There was an error, try again later"});
        });
}


exports.get_problem_status = async (req, res, next) => {
    try {
        const userProblem = await models.user_problem.findOne({
            where: {
                id_problem: req.params.problemId,
                id_user: req.user.id_user
            }
        });
        if (userProblem) {
            res.status(200).json({ status: userProblem.dataValues.status })
        } else {
            res.status(200).json({ status: "" })
        }
        
    } catch (err) {
        return res.status(500).json({ error: "There was an error, try again later"});
    }
}


exports.add_tag = async (req, res, next) => {
    try {
        const id = req.params.problemId;
        const problem = await models.problem.findByPk(id)
        if (!problem) {
            return res.status(404).json({
                message: "Problem NOT FOUND"
            });
        }
        const problem_tag = {
            id_problem: id,
            id_tag: req.body.id_tag
        }

        const problemTag = await models.problem_tag.create(problem_tag)
        return res.status(201).json(problemTag);
    } catch (error) {
        return res.status(500).json({ error: "There was an error, try again later"});
    }

}


exports.update_problem = async (req, res, next) => {
    const id = req.params.problemId;
    try {
        const problem = await models.problem.findByPk(id)

        if (!problem) {
            return res.status(404).json({
                message: "Problem NOT FOUND"
            });
        } else {

            if (req.user.role.description === 'mod' && problem.toJSON().owner !== req.user.username) {
                return res.status(401).json({
                    message: "Ownership needed"
                });
            }


            const problemBody = {
                title: req.body.title,
                topic: req.body.topic,
                input: req.body.input,
                output: req.body.output,
                note: req.body.note,
                score: req.body.score,
                time_limit: req.body.time_limit,
                memory_limit: req.body.memory_limit,
                test_file: req.body.test_file,
                solution: req.body.solution,
                tutorial: req.body.tutorial,
                checker: req.body.checker,
                status: req.body.status,
                id_contest: req.body.id_contest
            }

            await models.problem.update(problemBody, { where: { id_problem: id } });

            const examples = await models.example.bulkCreate(req.body.examples);


            await problem.setExamples(examples);

            await problem.setTags(req.body.tags);


            return res.status(200).json({
                message: "Updated problem with id : " + id
            });
        }
    }
    catch (err) {
        return res.status(500).json({ error: "There was an error, try again later"});
    }

}


exports.delete_problem = async (req, res, next) => {
    try {
        const id = req.params.problemId;
        const problem = await models.problem.findByPk(id);
        if (!problem) {
            return res.status(404).json({
                message: "Problem NOT FOUND"
            });
        }
        await models.problem.destroy({ where: { id_problem: id } });
        return res.status(200).json({
            message: "Deleted problem with id : " + id
        });

    } catch (error) {
        return res.status(500).json({ error: "There was an error, try again later"});
    }


}