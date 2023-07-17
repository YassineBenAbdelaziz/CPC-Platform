const { models } = require('../sequelize');
const sequelize = require('../sequelize');

exports.get_all = async (req, res, next) => {
    await models.tag.findAll()
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

exports.countByTag = async (req, res, next) => {
    try {
    const results = await models.tag.findAll({
        attributes: ["tag",
            [sequelize.fn('COUNT', sequelize.col('problems.id_problem')), 'n_tag'],
        ],
        include: [{
            model: models.problem,
            attributes: [],
            through: {
                attributes: []
              }
        }],
        group: ['tag'],
        raw: true,
    });

    return res.status(200).json(results);

    } 
    catch (err) {
        res.status(500).json({
            error : err,
        })
    }
    
}


exports.create_tag = async (req, res, next) => {
    const tag = {
        tag: req.body.tag
    }

    await models.tag.create(tag)
        .then(res.status(201).json({
            message: "Tag Created",
            tag: tag
        }))
        .catch(err => {
            res.status(500).json({ error: err });
        });
}


exports.get_tag = async (req, res, next) => {
    const id = req.params.tagId;
    await models.tag.findByPk(id)
        .then(tag => {
            if (!tag) {
                return res.status(404).json({
                    message: "Tag NOT FOUND"
                });
            } else {
                res.status(200).json(tag);
            }
        }).catch(err => {
            res.status(500).json({ error: err });
        });
}


exports.update_tag = async (req, res, next) => {
    const id = req.params.tagId;

    await models.tag.findByPk(id)
        .then(async tag => {
            if (!tag) {
                return res.status(404).json({
                    message: "Tag NOT FOUND"
                });
            } else {
                const tagBody = {
                    tag: req.body.tag
                }

                await models.tag.update(tagBody, { where: { id_tag: id } })
                    .then(() => {
                        res.status(200).json({
                            message: "Updated tag with id : " + id
                        });
                    })
            }
        }).catch(err => {
            res.status(500).json({ error: err });
        });
}


exports.delete_tag = async (req, res, next) => {
    const id = req.params.tagId;
    await models.tag.findByPk(id)
        .then(async tag => {
            if (!tag) {
                return res.status(404).json({
                    message: "Tag NOT FOUND"
                });
            } else {
                await models.tag.destroy({ where: { id_tag: id } })
                    .then(() => {
                        res.status(200).json({
                            message: "Deleted tag with id : " + id
                        });
                    })
            }
        }).catch(err => {
            res.status(500).json({ error: err });
        });
}