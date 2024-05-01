const { models } = require('../sequelize');
const Op = require('sequelize').Op;


exports.getUpcomingContests = (req, res, next) => {
    models.contest.findAndCountAll({
        where : {
            status : 'upcoming'
        }
    }).then( (data) => {
        return res.status(200).json(data);
    }).catch((err) => {
        return res.status(500).json({error : "Internal Server Error" });
    });
}

exports.getPreviousContests = async (req, res, next) => {

    try {
        
        if (req.body?.limit === undefined || req.body?.page === undefined) {
            return res.status(404).json({
                error: "Missing params",
            })
        }
        const limit = parseInt(req.body.limit);
        const offset = (parseInt(req.body.page) - 1) * limit;

        let queryParams = {
            attributes: ["id_contest", "title", "status", "date", "start", "duration"],
            offset: offset,
            limit: limit,
            subQuery: false,
            where : {
                status : 'closed'
            }
        }


        const results = await models.contest.findAndCountAll(queryParams);

        return res.status(200).json({...results});

    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error",
        });
    }
};




exports.getContestById = (req, res, next) => {
    models.contest.findByPk(req.params.id)
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            return res.status(500).json({ error: "There was an error, try again later"});
        });
};





exports.createContest = (req, res, next) => {
    models.contest.create({
        title: req.body.title,
        date: req.body.date,
        status : 'upcoming',
        start: req.body.start,
        duration: req.body.duration,
    })
        .then((data) => {
            res.status(201).json({
                message: "Create Successful",
            });
        })
        .catch((err) => {
            return res.status(500).json({ error: "There was an error, try again later"});
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
            return res.status(500).json({ error: "There was an error, try again later"});
        });
};



exports.updateContest = (req, res, next) => {
    const updatedFields = {};
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
            return res.status(500).json({ error: "There was an error, try again later"});
        });
};