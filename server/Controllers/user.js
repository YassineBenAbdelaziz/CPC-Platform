require('dotenv').config();

const { models } = require('../sequelize');
const sequelize = require('sequelize');
const { unlink } = require('node:fs/promises');
const e = require('express');


async function deletefile(path) {
    try {
        await unlink(path);
        console.log(`successfully deleted ${path}`);
    } catch (error) {
        console.error('there was an error:', error.message);
    }
};


exports.getAll = async (req, res, next) => {
    try {
        const result = await models.user.findAll({ attributes: ['id_user', 'username', 'score', 'rank', 'imagePath', 'id_role'] });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: "There was an error, try again later" });
    }
}


const difficultyCount = async (condition) => {
    const count = {
        easy: 0,
        medium: 0,
        hard: 0,
    }
    try {
        const problems = await models.problem.findAll(condition);
        for (let problem of problems) {
            if (problem.dataValues.score <= 100) {
                count.easy++;
            } else if (problem.dataValues.score > 100 && problem.dataValues.score <= 130) {
                count.medium++;
            } else {
                count.hard++;
            }
        }
    } catch(err) {
        return res.status(500).json({ error: "There was an error, try again later"});
    }
    return count;
}

exports.getUserProfile = async (req, res, next) => {
    const username = req.params.username;
    let user = {}
    try {
        user = await models.user.findOne({
            where: {
                username: username
            }
        });
    } catch (err) {
        return res.status(500).json({ error: "There was an error, try again later"});
    }

    if (!user) {
        res.status(404).json({ message: 'User Not Found' })
    } else {
        const userLangs = [];
        const langsMap = new Map();
        try {
            const langs = await models.user_lang.findAll({ where: { id_user: user.dataValues.id_user } });
            for(let lang of langs) {
                if (langsMap.has(lang.dataValues.lang)) {
                    langsMap.set(lang.dataValues.lang, langsMap.get(lang.dataValues.lang) + 1);
                } else {
                    langsMap.set(lang.dataValues.lang, 1);
                }
            }
        } catch(err) {
            return res.status(500).json({ error: "There was an error, try again later"});
        }
        for (let [lang, count] of langsMap.entries()) {
            userLangs.push({
                lang: lang,
                count: count
            })
        }

        const userSkills = [];
        try {
            const skills = await models.user_skill.findAll({ where: { id_user: user.dataValues.id_user } });
            for (let skill of skills) {
                userSkills.push({
                    skill: skill.dataValues.skill,
                    count: skill.dataValues.count
                });
            }
        } catch(err) {
            return res.status(500).json({ error: "There was an error, try again later"});
        }

        let solved = [];
        try {
            solved = await models.user_problem.findAll({
                where: {
                    id_user: user.id_user,
                    status: 'Accepted'
                }
            });
        } catch(err) {
            return res.status(500).json({ error: "There was an error, try again later"});
        }

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
            email: user.dataValues.email,
            fname: user.dataValues.fname,
            lname: user.dataValues.lname,
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
    if (req.body.username.trim().includes(' '))
        return res.status(401).json({
            message: "Username must not contain spaces."
        })
    if (req.body.email.trim().includes(' '))
        return res.status(401).json({
            message: "Email must not contain spaces."
        })  
     
    models.user.create({
        email: req.body.email.trim(),
        username: req.body.username.trim(),
        password: req.body.password,
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
        if (user.imagePath !== '../uploads/profile.webp') {
            deletefile(user.imagePath);
        }

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: "There was an error, try again later"});

    }
};


exports.updateUser = (req, res, next) => {
    const userId = req.params.id;

    if (req.user.id_user == userId) {
        const updatedFields = {};

        for (const [key, val] of Object.entries(req.body)) {
            updatedFields[key] = val;
        }

        delete updatedFields.id_role;
        
        if (req.file) {
            updatedFields["imagePath"] = req.file.path;
        }
        else {
            delete updatedFields.imagePath;
        }
        
        models.user.update(updatedFields,
            {
                where: {
                    id_user: userId,
                },
                individualHooks: true,

            })
            .then((data) => {
                if (data[0] == 0) {
                    return res.status(400).json(
                        {
                            error: 'No data provided for user update.'
                        });
                }
                else {
                    if (req.file && data[1][0]['_previousDataValues']['imagePath'] !== '../uploads/profile.webp') {
                        deletefile(data[1][0]['_previousDataValues']['imagePath']);
                    }

                    return res.status(200).json(
                        {
                            message: 'Update successful'
                        });
                }
            })
            .catch((err) => {
                return res.status(500).json({ error: "There was an error, try again later"});
            }
            );
    } else {
        res.status(404).json({ message: "You are logged to another account" })
    }
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
        role : req.user.role,
    }
    res.setHeader('Content-Type', 'application/json');
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
            role : req.user.role,
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



exports.editRole = async (req, res, next) => {
    const userRolePairs = req.body; // Expect an array of {id_user, id_role} objects

    try {
        for (let pair of userRolePairs) {
            const users = await models.user.findAll({
                where: {
                    id_user: userRolePairs.map(pair => pair.id_user)
                }
            });
        
            if (!users || users.length !== userRolePairs.length) {
                return res.status(404).json({
                        error: 'One or more users not found'
                    });
            }

            await models.user.update(
                {
                    id_role: pair.id_role
                },
                {
                    where: {
                        id_user: pair.id_user
                    },
                }
            );
        }
        return res.status(200).json({ message: 'Roles updated successfully' });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};