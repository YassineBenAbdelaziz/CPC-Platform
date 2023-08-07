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
        await models.problem.findByPk(problemId)
            .then(data => {
                const problem = data.dataValues;
                timeLimit = problem.time_limit;
                memoryLimit = problem.memory_limit;
                testFile = problem.test_file;
            })

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
                "expected_output": outputs[i]
            }
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


get_submission_details = async (tokens) => {
    const subResult = {
        time: 0,
        memory: 0,
        result: ""
    }
    await axios.get(jugdeUrl + `submissions/batch?tokens=${tokens}&base64_encoded=false&fields=stdout,status,language_id,time,memory`)
        .then(res => {
            console.log('Get submission from judge successful')
            const sub = res.data.submissions;
            for (let i = 0; i < sub.length; i++) {
                subResult.time = Math.max(subResult.time, sub[i].time * 1000)
                subResult.memory = Math.max(subResult.memory, sub[i].memory)
                subResult.result = sub[i].status.description
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


exports.get_submissions_by_problem_and_user = async (req, res, next) => {
    let subs = [];
    await models.submission.findAll({
        where: {
            userIdUser: req.params.userId,
            problemIdProblem: req.params.problemId,
            [sequelize.Op.or]: [
                { result: { [sequelize.Op.like]: "Processing%" } },
                { result: "In Queue" }
            ]

        }
    }).then(submissions => {
        submissions.map(sub => {
            subs.push(sub.dataValues)
        })
    })

    for (let sub of subs) {
        if (sub && sub.id_submission) {
            const subResult = await get_submission_details(sub.tokens);
            await models.submission.update(subResult, { where: { id_submission: sub.id_submission } })
        }
    }

    let username = ""
    await models.user.findByPk(req.params.userId)
        .then(user => {
            username = user.dataValues.username
        }).catch(err => {
            console.log('User Not Found')
            res.status(404).json(err)
        })

    let problemName = ""
    await models.problem.findByPk(req.params.problemId)
        .then(problem => {
            problemName = problem.dataValues.title
        }).catch(err => {
            console.log('Problem Not Found')
            res.status(404).json(err)
        })

    await models.submission.findAll({
        where: {
            userIdUser: req.params.userId,
            problemIdProblem: req.params.problemId
        }
    }).then(async submissions => {
        let result = []
        for (let sub of submissions) {
            sub.dataValues.user = username
            sub.dataValues.problem = problemName
            result.push(sub.dataValues)
        }
        res.status(200).json(result)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })

}


exports.get_submissions_by_problem = async (req, res, next) => {
    await models.submission.findAll({
        where: {
            problemIdProblem: req.params.problemId
        }
    }).then(async submissions => {
        let result = []
        for (let sub of submissions) {
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
        res.status(200).json(result)
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
                await axios.get(jugdeUrl + `submissions/batch?tokens=${submission.dataValues.tokens}&base64_encoded=false&fields=stdin,stdout,expected_output,status,time,memory`)
                    .then(res => {
                        console.log('Get submission from judge successful')
                        const sub = res.data.submissions;
                        for (let i = 0; i < sub.length; i++) {
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
                // console.log(result)
                res.status(200).json({
                    count: result.length,
                    testCases: result
                });
            }
        }).catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });
}
