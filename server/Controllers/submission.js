const { models } = require('../sequelize');


exports.get_all = async (req, res, next) => {
    await models.submission.findAll()
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}


exports.create_submission = async (req, res, next) => {
    const submission = {
        lang: req.body.lang,
        result: req.body.result,
        code: req.body.code,
        output: req.body.output
    }

    await models.submission.create(submission)
        .then(res.status(201).json({
            message: "Submission Created",
            submission: submission
        }))
        .catch(err => {
            res.status(500).json({ error: err });
        });
}


exports.get_submission = async (req, res, next) => {
    const id = req.params.submissionId;
    await models.submission.findByPk(id)
        .then(submission => {
            if (!submission) {
                return res.status(404).json({
                    message: "Submission NOT FOUND"
                });
            } else {
                res.status(200).json(submission);
            }
        }).catch(err => {
            res.status(500).json({ error: err });
        });
}
