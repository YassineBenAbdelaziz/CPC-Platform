const sequelize = require('sequelize');
const { models } = require('../sequelize');
const axios = require("axios");

const jugdeUrl = "http://localhost:2358/";

exports.get_all = async (req, res, next) => {
    await models.submission.findAll()
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ error: err });
        });
}


exports.create_submission = async (req, res, next) => {
    const submission = {
        code: req.body.code,
        tokens: "",
        lang: "",
        result: "In Queue",
        time: 0,
        memory: 0,
        problemIdProblem: req.body.problemId,
        userIdUser: req.body.userId
    }

    if (req.body.langId === 50) {
        submission.lang = "C"
    } else if (req.body.langId === 54) {
        submission.lang = "C++"
    } else if (req.body.langId === 62) {
        submission.lang = "Java"
    } else if (req.body.langId === 71) {
        submission.lang = "Python"
    }

    if (submission.code !== "") {
        const problemId = submission.problemIdProblem
        let timeLimit = 0;
        let memoryLimit = "";
        let testFile = "";
        let checker = "";

        console.log("The problem id :" + problemId);
        const data = await models.problem.findByPk(problemId);
        console.log("data selected : " + data)
        const problem = data.dataValues;
        timeLimit = problem.time_limit;
        memoryLimit = problem.memory_limit;
        testFile = problem.test_file;
        checker = problem.checker;

        const tests = testFile.split("\nexpected\n");
        const inputs = tests[0].split("\nnext\n");
        const outputs = tests[1].split("\nnext\n");

        let bodies = []
        for (let i = 0; i < inputs.length - 1; i++) {
            const body = {
                "source_code": submission.code,
                "language_id": req.body.langId,
                "memory_limit": memoryLimit,
                "cpu_time_limit": timeLimit,
                "stdin": inputs[i],
            }
            if (!checker) body.expected_output = outputs[i]
            bodies.push(body)
        }

        let tokens = "";
        await axios.post(jugdeUrl + "submissions/batch/?base64_encoded=false", {
            "submissions": bodies
        }).then(result => {
            console.log('Post submission to judge successful')
            result.data && result.data.map(item => tokens += item.token + ",")
            submission.tokens = tokens;
        }).catch(err => {
            console.log('Post submission to judge failed')
            console.log(err)
        });

    } else {
        submission.result = "No Code"
    }

    await models.submission.create(submission)
        .then(res.status(201).json({
            message: "Submission Created",
            submission: submission
        }))
        .catch(error => {
            console.log('Create submission failed')
            console.log(error)
            res.status(500).json({ error: error });
        });
}


get_submission_details_no_checker = async (tokens) => {
    const subResult = {
        time: 0,
        memory: 0,
        result: ""
    }
    await axios.get(jugdeUrl + `submissions/batch?tokens=${tokens}&base64_encoded=false&fields=status,time,memory`)
        .then(res => {
            console.log('Get submission from judge successful')
            const sub = res.data.submissions;
            for (let i = 0; i < sub.length; i++) {
                subResult.time = Math.max(subResult.time, sub[i].time * 1000)
                subResult.memory = Math.max(subResult.memory, sub[i].memory)
                subResult.result = sub[i].status.description
                subResult.result = subResult.result === "Runtime Error (NZEC)" ? "Memory Limit Exceeded" : subResult.result
                subResult.result = subResult.result.includes('Runtime Error') ? "Runtime Error" : subResult.result
                if (subResult.result !== "Accepted" && subResult.result !== "In Queue" && subResult.result !== "Processing") {
                    break;
                }
            }
        }).catch(err => {
            console.log('Get submission from judge failed')
            console.log(err)
        });
    return subResult;
}


get_submission_details_checker = async (tokens, checker) => {
    const subResult = {
        time: 0,
        memory: 0,
        outputs: []
    }
    await axios.get(jugdeUrl + `submissions/batch?tokens=${tokens}&base64_encoded=false&fields=stdout,time,memory`)
        .then(res => {
            console.log('Get submission from judge successful')
            const sub = res.data.submissions;
            for (let i = 0; i < sub.length; i++) {
                subResult.time = Math.max(subResult.time, sub[i].time * 1000)
                subResult.memory = Math.max(subResult.memory, sub[i].memory)
                subResult.outputs.push(sub[i].stdout)
            }
        }).catch(err => {
            console.log('Get submission from judge failed')
            console.log(err)
        });

    let bodies = []
    for (let i = 0; i < outputs.length - 1; i++) {
        const body = {
            "source_code": checker,
            "language_id": 54,
            "stdin": outputs[i],
        }
        bodies.push(body)
    }

    let newTokens = "";
    await axios.post(jugdeUrl + "submissions/batch/?base64_encoded=false", {
        "submissions": bodies
    }).then(result => {
        console.log('Post submission to judge successful')
        result.data && result.data.map(item => newTokens += item.token + ",")
        console.log(newTokens)
    }).catch(err => {
        console.log('Post submission to judge failed')
        console.log(err)
    });

    return subResult;
}


exports.get_submissions_by_problem_and_user = async (req, res, next) => {
    if (req.user) {
        if (!req.body.page || !req.body.limit) {
            return res.status(404).json({
                error: "Missing params",
            })
        }
        const limit = parseInt(req.body.limit);
        const offset = (parseInt(req.body.page) - 1) * limit;

        let subs = [];
        await models.submission.findAll({
            where: {
                userIdUser: req.params.userId,
                problemIdProblem: req.params.problemId,
                [sequelize.Op.or]: [
                    { result: { [sequelize.Op.like]: "Processing%" } },
                    { result: "In Queue" }
                ]
            },
            offset: offset,
            limit: limit,
            subQuery: false,
            order: [["createdAt", "desc"]]
        }).then(submissions => {
            submissions.map(sub => {
                subs.push(sub.dataValues)
            })
        })

        let username = ""
        await models.user.findByPk(req.params.userId)
            .then(user => {
                username = user.dataValues.username
            }).catch(err => {
                console.log('User Not Found')
                return res.status(404).json(err)
            })

        const user = req.user;
        const problem = await models.problem.findByPk(req.params.problemId);

        const problemName = problem.dataValues.title
        const checker = problem.dataValues.checker

        for (let sub of subs) {
            if (sub && sub.id_submission) {
                let subResult = {};
                if (checker) {
                    subResult = await get_submission_details_checker(sub.tokens);
                } else {
                    subResult = await get_submission_details_no_checker(sub.tokens, checker);
                }
                await models.submission.update(subResult, { where: { id_submission: sub.id_submission } })

                // Add score to user if it's solved
                const addScore = async () => {
                    const newScore = user.score + problem.dataValues.score;
                    let rank = 'Newbie';
                    if (newScore >= 1300) {
                        rank = 'Master'
                    } else if (newScore >= 700 && newScore < 1000) {
                        rank = 'Expert'
                    }
                    user.score = newScore;
                    user.rank = rank;
                    await models.user.update(user, { where: { id_user: user.id_user } })
                        .then(() => {
                            console.log('update successful')
                        }).catch(err => {
                            console.log('Error while adding new score to user')
                            console.log(err)
                        })
                }

                //Add langs to user profile
                const addLangs = async () => {
                    await models.user_lang.findOne({
                        where: {
                            id_user: user.id_user,
                            lang: sub.lang,
                        }
                    }).then(async (result) => {
                        if (!result) {
                            await models.user_lang.create({
                                id_user: user.id_user,
                                lang: sub.lang,
                                count: 1
                            }).catch(err => {
                                console.log(err)
                            });
                        } else {
                            await models.user_lang.update({
                                id_user: user.id_user,
                                lang: sub.lang,
                                count: result.dataValues.count + 1
                            }, {
                                where: {
                                    id_user: user.id_user,
                                    lang: sub.lang,
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }

                //Add skills to user profile
                const addSkills = async () => {
                    let tags = [];
                    await models.problem_tag.findAll({
                        where: {
                            id_problem: problem.dataValues.id_problem
                        }
                    }).then(async (problemTags) => {
                        for (let problemTag of problemTags) {
                            await models.tag.findByPk(problemTag.dataValues.id_tag)
                                .then(tag => tags.push(tag.dataValues.tag))
                                .catch(err => console.log(err));
                        }
                    }).catch(err => {
                        console.log(err)
                    });
                    for (let tag of tags) {
                        await models.user_skill.findOne({
                            where: {
                                id_user: user.id_user,
                                skill: tag,
                            }
                        }).then(async (result) => {
                            if (!result) {
                                await models.user_skill.create({
                                    id_user: user.id_user,
                                    skill: tag,
                                    count: 1
                                }).catch(err => {
                                    console.log(err)
                                });
                            } else {
                                await models.user_skill.update({
                                    id_user: user.id_user,
                                    skill: tag,
                                    count: result.dataValues.count + 1
                                }, {
                                    where: {
                                        id_user: user.id_user,
                                        skill: tag,
                                    }
                                }).catch(err => {
                                    console.log(err)
                                })
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                }

                // Create status for the problem
                const userProblem = await models.user_problem.findOne({
                    where: {
                        id_problem: req.params.problemId,
                        id_user: user.id_user
                    }
                });
                if (!userProblem) {
                    await models.user_problem.create({
                        id_user: user.id_user,
                        id_problem: req.params.problemId,
                        status: subResult.result
                    }).then((newUserProblem) => {
                        if (newUserProblem.dataValues.status === 'Accepted') {
                            console.log('Submission accepted for the first time')
                            addScore();
                            addLangs();
                            addSkills();
                        }
                    }).catch(err => {
                        console.log('Error while submitting for the first time')
                        console.log(err)
                    });
                } else {
                    if (userProblem.status !== 'Accepted') {
                        await models.user_problem.update(
                            { status: subResult.result },
                            {
                                where: {
                                    id_problem: req.params.problemId,
                                    id_user: user.id_user
                                }
                            }
                        ).catch(error => console.log(error))

                        if (subResult.result === 'Accepted') {
                            console.log('Submission accepted for the first time')
                            addScore();
                            addLangs();
                            addSkills();
                        }
                    } else {
                        console.log('Problem already solved')
                        // addLangs();
                    }
                }

            }
        }

        await models.submission.findAndCountAll({
            where: {
                userIdUser: req.params.userId,
                problemIdProblem: req.params.problemId
            },
            offset: offset,
            limit: limit,
            subQuery: false,
            order: [["createdAt", "desc"]]
        }).then(async submissions => {
            let result = []
            for (let sub of submissions.rows) {
                sub.dataValues.user = username
                sub.dataValues.problem = problemName
                result.push(sub.dataValues)
            }
            res.status(200).json({
                count: submissions.count,
                rows: result
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    } else {
        res.status(401).json({ message: 'Unauthorized' })
    }
}


exports.get_submissions_by_problem = async (req, res, next) => {
    if (!req.body.page || !req.body.limit) {
        return res.status(404).json({
            error: "Missing params",
        })
    }
    const limit = parseInt(req.body.limit);
    const offset = (parseInt(req.body.page) - 1) * limit;

    await models.submission.findAndCountAll({
        where: {
            problemIdProblem: req.params.problemId
        },
        offset: offset,
        limit: limit,
        subQuery: false,
        order: [["createdAt", "desc"]]
    }).then(async submissions => {
        let result = []
        for (let sub of submissions.rows) {
            await models.user.findByPk(sub.dataValues.userIdUser)
                .then(async user => {
                    sub.dataValues.user = user.dataValues.username
                    await models.problem.findByPk(sub.dataValues.problemIdProblem)
                        .then(problem => {
                            sub.dataValues.problem = problem.dataValues.title
                        }).catch(err => {
                            console.log('Problem Not Found')
                            res.status(404).json(err)
                        })
                    result.push(sub.dataValues)
                }).catch(err => {
                    console.log('User Not Found')
                    res.status(404).json(err)
                })
        }
        res.status(200).json({
            count: submissions.count,
            rows: result
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
}


exports.get_submissions_by_user = async (req, res, next) => {
    if (!req.body.page || !req.body.limit) {
        return res.status(404).json({
            error: "Missing params",
        })
    }
    const limit = parseInt(req.body.limit);
    const offset = (parseInt(req.body.page) - 1) * limit;

    await models.submission.findAndCountAll({
        where: {
            userIdUser: req.params.userId
        },
        offset: offset,
        limit: limit,
        subQuery: false,
        order: [["createdAt", "desc"]]
    }).then(async submissions => {
        let result = []
        for (let sub of submissions.rows) {
            await models.user.findByPk(sub.dataValues.userIdUser)
                .then(async user => {
                    sub.dataValues.user = user.dataValues.username
                    await models.problem.findByPk(sub.dataValues.problemIdProblem)
                        .then(problem => {
                            sub.dataValues.problem = problem.dataValues.title
                        }).catch(err => {
                            console.log('Problem Not Found');
                            // return res.status(404).json(err);
                        })
                    result.push(sub.dataValues)
                }).catch(err => {
                    console.log('User Not Found')
                    // return res.status(404).json(err);
                })
        }
        return res.status(200).json({
            count: submissions.count,
            rows: result
        });
    }).catch(err => {
        console.log(err);
        return res.status(500).json(err);
    })
}


exports.get_submission = async (req, res, next) => {
    const id = req.params.submissionId;
    await models.submission.findByPk(id)
        .then(async submission => {
            if (!submission) {
                return res.status(404).json({
                    message: "Submission NOT FOUND"
                });
            } else {
                let result = []
                let code = ""
                await axios.get(jugdeUrl + `submissions/batch?tokens=${submission.dataValues.tokens}&base64_encoded=false&fields=source_code,stdin,stdout,expected_output,status,time,memory`)
                    .then(res => {
                        console.log('Get submission from judge successful')
                        const sub = res.data.submissions;
                        for (let i = 0; i < sub.length; i++) {
                            if (i === 0) {
                                code = sub[i].source_code
                            }
                            const subResult = {
                                time: 0,
                                memory: 0,
                                stdin: "",
                                stdout: "",
                                expected_output: "",
                                result: ""
                            }
                            subResult.time = sub[i].time * 1000
                            subResult.memory = sub[i].memory
                            subResult.stdin = sub[i].stdin
                            subResult.stdout = sub[i].stdout
                            subResult.expected_output = sub[i].expected_output
                            subResult.result = sub[i].status.description
                            subResult.result = subResult.result === "Runtime Error (NZEC)" ? "Memory Limit Exceeded" : subResult.result
                            subResult.result = subResult.result.includes('Runtime Error') ? "Runtime Error" : subResult.result
                            result.push(subResult)
                            if (subResult.result !== "Accepted" && subResult.result !== "In Queue" && subResult.result !== "Processing") {
                                break;
                            }
                        }
                    }).catch(err => {
                        console.log('Get submission from judge failed')
                        console.log(err)
                    });
                res.status(200).json({
                    code: code,
                    count: result.length,
                    testCases: result
                });
            }
        }).catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });
}
