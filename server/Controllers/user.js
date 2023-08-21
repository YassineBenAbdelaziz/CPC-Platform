require('dotenv').config();

const { models } = require('../sequelize');
const sequelize = require('sequelize');
const { unlink } = require('node:fs/promises');
const bcrypt = require('bcrypt');



async function deletefile(path) {
    try {
        await unlink(path);
        console.log(`successfully deleted ${path}`);
    } catch (error) {
        console.error('there was an error:', error.message);
    }
};


exports.getAll = async (req, res, next) => {
    await models.user.findAll({
        attributes: ['id_user', 'username', 'score', 'rank', 'imagePath']
    })
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}


exports.getUserProfile = async (req, res, next) => {
    const username = req.params.username;
    let user = {}
    await models.user.findOne({
        where: {
            username: username
        }
    }).then((result) => {
        user = result;
    }).catch(err => {
        console.log(err)
        return res.status(500).json(err)
    });

    if (!user) {
        res.status(404).json({ message: 'User Not Found' })
    } else {
        const userLangs = [];
        await models.user_lang.findAll({ where: { id_user: user.dataValues.id_user } })
            .then(langs => {
                for (let lang of langs) {
                    userLangs.push({
                        lang: lang.dataValues.lang,
                        count: lang.dataValues.count
                    })
                }
            }).catch(err => {
                console.log(err)
                return res.status(500).json(err)
            });

        const userSkills = [];
        await models.user_skill.findAll({ where: { id_user: user.dataValues.id_user } })
            .then(skills => {
                for (let skill of skills) {
                    userSkills.push({
                        skill: skill.dataValues.skill,
                        count: skill.dataValues.count
                    })
                }
            }).catch(err => {
                console.log(err)
                return res.status(500).json(err)
            });

        const difficultyCount = async (condition) => {
            const count = {
                easy: 0,
                medium: 0,
                hard: 0,
            }
            await models.problem.findAll(condition)
                .then(problems => {
                    for (let problem of problems) {
                        if (problem.dataValues.score <= 100) {
                            count.easy++;
                        } else if (problem.dataValues.score > 100 && problem.dataValues.score <= 130) {
                            count.medium++;
                        } else {
                            count.hard++;
                        }
                    }
                }).catch(err => {
                    console.log(err)
                    return res.status(500).json(err)
                });
            return count;
        }

        let solved = [];
        await models.user_problem.findAll({
            where: {
                id_user: user.id_user,
                status: 'Accepted'
            }
        }).then((results) => {
            solved = results;
        }).catch(err => {
            console.log(err)
            return res.status(500).json(err)
        });

        const condition = []
        for (let x of solved) {
            condition.push({ id_problem: x.dataValues.id_problem })
        }

        const allCount = await difficultyCount();
        const solvedCount = await difficultyCount({
            where: {
                [sequelize.Op.or]: condition
            }
        })

        return res.status(200).json({
            id_user: user.dataValues.id_user,
            username: req.params.username,
            score: user.dataValues.score,
            rank: user.dataValues.rank,
            imagePath: user.dataValues.imagePath,
            langs: userLangs,
            skills: userSkills,
            allCount: allCount,
            solvedCount: solvedCount,
        })
    }
}


exports.register = (req, res, next) => {
    models.user.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
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





exports.deleteUser = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await models.user.findByPk(userId);
        if (!user) {
            return res.status(404).json(
                {
                    error: 'User not found'
                });
        }

        await models.user.destroy(
            {
                where: {
                    id_user: userId
                }
            });
        if (user.imagePath !== '../img/profile.jpg') {
            deletefile(user.imagePath);
        }


        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }

};


exports.updateUser = (req, res, next) => {

    const userId = req.params.id;
    const updatedFields = {};

    for (const [key, val] of Object.entries(req.body)) {
        updatedFields[key] = val;
    }

    console.log(req.file);

    if (req.file) {
        updatedFields["imagePath"] = req.file.path;
    }
    else {
        delete updatedFields.imagePath;
    }

    models.user.update(updatedFields,
        {
            where: {
                id_user: req.params.id,
            },
            individualHooks: true,

        })
        .then((data) => {

            if (data[0] == 0) {
                return res.status(404).json(
                    {
                        error: 'User not found'
                    });
            }
            else {
                if (req.file && data[1][0]['_previousDataValues']['imagePath'] !== '../img/profile.jpg') {
                    deletefile(data[1][0]['_previousDataValues']['imagePath']);
                }

                return res.status(200).json(
                    {
                        message: 'Update successful'
                    });
            }
        })
        .catch((err) => {
            return res.status(500).json({ error: err });
        }
        );
};





exports.login = (req, res, next) => {

    if (req.body.remember) {
        // Set cookie age to 1 week
        req.session.cookie.maxAge = 604800000;
    }
    const user = {
        id: req.user.id_user,
        username: req.user.username,
        img: req.user.imagePath,
    }
    return res.status(200).json({
        message: "Login successful",
        data: user,
    });
}




exports.logout = (req, res, next) => {

    req.logout((err) => {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({
                message: "Logout successful",
            });
        }
    });

}

exports.getCurrentUser = (req, res, next) => {
    if (req.user) {
        const user = {
            id: req.user.id_user,
            username: req.user.username,
            img: req.user.imagePath,
        }
        return res.status(200).json({
            status: 'OK',
            data: user,
        })
    }
    else {
        return res.status(200).json({
            status: 'Invalid',
        })
    }

}