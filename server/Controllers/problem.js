const { models } = require('../sequelize');
const { Op } = require("sequelize");

exports.get_all = async (req, res, next) => {
    await models.problem.findAll()
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

exports.getPage = async (req, res, next) => {
   try {
    
    const params = []
    if (!req.body.page || !req.body.limit) {
        return res.status(404).json({
            error : "Missing params",
        })
    }
    const limit = parseInt(req.body.limit);
    const offset = ( parseInt(req.body.page ) - 1 )* limit ;

    const queryParams = {
        attributes : ["title","score"],
        offset: offset,
        limit: limit ,
        subQuery : false,

          
    }

    if (req.body.column && req.body.type) {
        params.push(req.body.column);
        params.push(req.body.type);
        queryParams.order = [params]
    }

    if (req.body.tags) {
        queryParams.include =         [{
            model: models.tag,
              where: {
                '$tags.tag$' : {
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
    return res.status(200).json({results }) ;
    }
    
    catch (err) {
        return res.status(500).json({
            error : err,
        })
    }
    
}

exports.create_problem =  (req, res, next) => {
    const problem = {
        title: req.body.title,
        topic: req.body.topic,
        input: req.body.input,
        output: req.body.output,
        note: req.body.note,
        score: req.body.score,
        time_limit: req.body.time_limit,
        memory_limit: req.body.memory_limit,
        test_file: req.body.test_file,
        solution_file: req.body.solution_file,
        status: req.body.status,
        id_contest: req.body.id_contest
    }

    models.problem.create(problem)
        .then((problem => {
            res.status(201).json(problem)
        }))
        .catch(err => {
            res.status(500).json({ error: err });
        });
}


exports.get_problem = async (req, res, next) => {
    const id = req.params.problemId;
    await models.problem.findByPk(id)
        .then(problem => {
            if (!problem) {
                return res.status(404).json({
                    message: "Problem NOT FOUND"
                });
            } else {
                res.status(200).json(problem);
            }
        }).catch(err => {
            res.status(500).json({ error: err });
        });
}


exports.get_problems_by_contest = async (req, res, next) => {
    await models.problem.findAll({
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
            res.status(500).json({ error: err });
        });
}


exports.update_problem = async (req, res, next) => {
    const id = req.params.problemId;

    await models.problem.findByPk(id)
        .then(async problem => {
            if (!problem) {
                return res.status(404).json({
                    message: "Problem NOT FOUND"
                });
            } else {
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
                    solution_file: req.body.solution_file,
                    status: req.body.status,
                    id_contest: req.body.id_contest
                }

                await models.problem.update(problemBody, { where: { id_problem: id } })
                    .then(() => {
                        res.status(200).json({
                            message: "Updated problem with id : " + id
                        });
                    })
            }
        }).catch(err => {
            res.status(500).json({ error: err });
        });
}


exports.delete_problem = async (req, res, next) => {
    const id = req.params.problemId;
    await models.problem.findByPk(id)
        .then(async problem => {
            if (!problem) {
                return res.status(404).json({
                    message: "Problem NOT FOUND"
                });
            } else {
                await models.problem.destroy({ where: { id_problem: id } })
                    .then(() => {
                        res.status(200).json({
                            message: "Deleted problem with id : " + id
                        });
                    })
            }
        }).catch(err => {
            res.status(500).json({ error: err });
        });
}