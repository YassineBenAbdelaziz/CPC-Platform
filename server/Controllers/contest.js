const { models } = require('../sequelize');
const Op = require('sequelize').Op;


exports.getContests = (req, res, next) => {
    models.contest.findAll()
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
};




exports.getContestById = (req, res, next) => {
    models.contest.findByPk(req.params.id)
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
};





exports.createContest = (req, res, next) => {
    models.contest.create({
        title: req.body.title,
        status: req.body.status,
        date: req.body.date,
        start: req.body.start,
        end: req.body.end,
    })
        .then((data) => {
            res.status(201).json({
                message: "Create Successful",
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};



exports.deleteContest = (req, res, next) => {
    models.contest.destroy({
        where: {
            id_contest: req.params.id,
        }
    })
        .then((data) => {
            res.status(201).json({
                message: "Delete Successful",
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};



exports.updateContest = (req, res, next) => {
    const updatedFields = {};
    console.log(req.body)
    for (const [key, val] of Object.entries(req.body)) {
        updatedFields[key] = val;
    }

    models.contest.update(updatedFields,
        {
            where: {
                id_contest: req.params.id,
            }
        })
        .then((data) => {
            res.status(201).json({
                message: "Update Successful",
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};