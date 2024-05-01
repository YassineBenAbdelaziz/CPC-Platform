const { models } = require('../sequelize');
const sequelize = require('../sequelize');

exports.get_all = (req, res, next) => {
    models.tag.findAll()
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            return res.status(500).json({ error: "There was an error, try again later"});
        });
}

exports.countByTag = async (req, res, next) => {
    try {
        const results = await models.tag.findAll({
            attributes: ["id_tag", "tag",
                [sequelize.fn('COUNT', sequelize.col('problems.id_problem')), 'n_tag'],
            ],
            include: [{
                model: models.problem,
                attributes: [],
                through: {
                    attributes: []
                }
            }],
            group: ['tag.id_tag', 'tag.tag'],
            raw: true,
        });

        return res.status(200).json(results);

    }
    catch (err) {
        return res.status(500).json({ error: "There was an error, try again later"});
    }

}


exports.create_tag = (req, res, next) => {
    const tag = {
        tag: req.body.tag
    }

    models.tag.create(tag)
        .then(res.status(201).json({
            message: "Tag Created",
            tag: tag
        }))
        .catch(err => {
            return res.status(500).json({ error: "There was an error, try again later"});
        });
}


exports.get_tag = (req, res, next) => {
    const id = req.params.tagId;
    models.tag.findByPk(id)
        .then(tag => {
            if (!tag) {
                return res.status(404).json({
                    message: "Tag NOT FOUND"
                });
            } else {
                res.status(200).json(tag);
            }
        }).catch(err => {
            return res.status(500).json({ error: "There was an error, try again later"});
        });
}


exports.get_tags_by_problem = async (req, res, next) => {
    try {
        const results = await models.problem.findOne({
            where: { id_problem: req.params.problemId },
            attributes: ["id_problem"],
            include: [{
                model: models.tag,
                attributes: ["id_tag", "tag"],
                through: {
                    attributes: []
                }
            }],
        });
        return res.status(200).json(results);

    }
    catch (err) {
        return res.status(500).json({ error: "There was an error, try again later"});
    }
}


exports.update_tag = async (req, res, next) => {
    try {
        const id = req.params.tagId;
        const tag = await models.tag.findByPk(id);
        if (!tag) {
            return res.status(404).json({
                message: "Tag NOT FOUND"
            });
        }
        else {
            const tagBody = {
                tag: req.body.tag
            }
        }
        await models.tag.update(tagBody, { where: { id_tag: id } });
        res.status(200).json({
            message: "Updated tag with id : " + id
        });

    } catch (error) {
        return res.status(500).json({ error: "There was an error, try again later"});
    }

}


exports.delete_tag = async (req, res, next) => {
    try {
        const id = req.params.tagId;
        const tag = await models.tag.findByPk(id);
        if (!tag) {
            return res.status(404).json({
                message: "Tag NOT FOUND"
            });
        }
        await models.tag.destroy({ where: { id_tag: id } });
        res.status(200).json({
            message: "Deleted tag with id : " + id
        });
    } catch (error) {
        return res.status(500).json({ error: "There was an error, try again later"});
    }

}


exports.delete_tags = async (req, res, next) => {
    try {
        const ids = req.body.tagIds; 
        if (!ids || ids.length === 0) {
            return res.status(400).json({
                message: "No ids provided"
            });
        }
        const result = await models.tag.destroy({ where: { id_tag: ids } });
        if (result === 0) {
            return res.status(404).json({
                message: "No tags found with the provided ids"
            });
        }
        res.status(200).json({
            message: `Deleted ${result} tags`
        });
    } catch (error) {
        return res.status(500).json({ error: "There was an error, try again later"});
    }
}


exports.update_tags = async (req, res, next) => {
    try {
        const tags = req.body;
        if (!tags || tags.length === 0) {
            return res.status(400).json({
                message: "No tags provided"
            });
        }
        const results = await Promise.all(tags.map(async ({ id_tag, tag }) => {
            if (!id_tag || !tag) {
                throw new Error("id_tag and tag are required for each tag");
            }
            const [tagInstance, created] = await models.tag.upsert({ id_tag, tag }, { returning: true });
            return {
                message: created ? "Tag created" : "Tag updated",
                tag: tagInstance
            };
        }));
        res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ error: "There was an error, try again later"});
    }
}