const sequelize = require('sequelize');
const { models } = require('../sequelize');
const axios = require("axios");

const jugdeUrl = "http://localhost:2358/";

exports.get_all = (req, res, next) => {
    models.submission.findAll()
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}


exports.create_submission = async (req, res, next) => {
    try {
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

            const data = await models.problem.findByPk(problemId);
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
            const result = await axios.post(jugdeUrl + "submissions/batch/?base64_encoded=false", {
                "submissions": bodies
            });
            console.log('Post submission to judge successful')
            result.data && result.data.map(item => tokens += item.token + ",")
            submission.tokens = tokens;
        }
        else {
            submission.result = "No Code"
        }

        await models.submission.create(submission);
        res.status(201).json({
            message: "Submission Created",
            submission: submission
        })

    } catch (err) {
        console.log('Create submission failed')
        console.log(err)
        res.status(500).json({ error: err });

    }

}


get_submission_details_no_checker = async (tokens) => {
    try {
        const subResult = {
            time: 0,
            memory: 0,
            result: ""
        }
        const result = await axios.get(jugdeUrl + `submissions/batch?tokens=${tokens}&base64_encoded=false&fields=status,time,memory`)
        console.log('Get submission from judge successful')
        const sub = result.data.submissions;
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
        return subResult;
    } catch (err) {
        console.log('Get submission from judge failed')
        console.log(err)
    }
}


get_submission_details_checker = async (tokens, checker) => {
    try {
        const subResult = {
            time: 0,
            memory: 0,
            outputs: []
        }
        const res = await axios.get(jugdeUrl + `submissions/batch?tokens=${tokens}&base64_encoded=false&fields=stdout,time,memory`)
        console.log('Get submission from judge successful')
        const sub = res.data.submissions;
        for (let i = 0; i < sub.length; i++) {
            subResult.time = Math.max(subResult.time, sub[i].time * 1000)
            subResult.memory = Math.max(subResult.memory, sub[i].memory)
            subResult.outputs.push(sub[i].stdout)
        }

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
        const result = await axios.post(jugdeUrl + "submissions/batch/?base64_encoded=false", {
            "submissions": bodies
        });
        console.log('Post submission to judge successful')
        result.data && result.data.map(item => newTokens += item.token + ",")
        console.log(newTokens);
        return subResult;
    } catch (err) {
        console.log('Get submission from judge failed')
        console.log(err)
    }
}

// Add score to user if it's solved 
async function addScore(problem,user) {
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
}


//Add langs to user profile
async function addLangs(user, sub, problem) {
    const result = await models.user_lang.findOne({
        where: {
            id_user: user.id_user,
            id_problem: problem.dataValues.id_problem,
            lang: sub.lang,
        }
    });
    if (!result) {
        await models.user_lang.create({
            id_user: user.id_user,
            id_problem: problem.dataValues.id_problem,
            lang: sub.lang,
            count: 1
        });
    }
}


//Add skills to user profile
async function addSkills(problem,user) {
    let tags = [];
    const problemTags = await models.problem_tag.findAll({
        where: {
            id_problem: problem.dataValues.id_problem
        }
    });
    for (let problemTag of problemTags) {
        let tag = await models.tag.findByPk(problemTag.dataValues.id_tag)
        tags.push(tag.dataValues.tag)
    }

    for (let tag of tags) {
        const result = await models.user_skill.findOne({
            where: {
                id_user: user.id_user,
                skill: tag,
            }
        });
        if (!result) {
            try {
                await models.user_skill.create({
                    id_user: user.id_user,
                    skill: tag,
                    count: 1
                });
            } catch(err) {
                console.log(err);
            }
        } else {
            try {
                await models.user_skill.update({
                    id_user: user.id_user,
                    skill: tag,
                    count: result.dataValues.count + 1
                }, {
                    where: {
                        id_user: user.id_user,
                        skill: tag,
                    }
                });
            } catch(err) {
                console.log(err);
            }
        }
    }
}

exports.get_submissions_by_problem_and_user = async (req, res, next) => {
    try {
        if (req.user) {
            if (!req.body.page || !req.body.limit) {
                return res.status(404).json({
                    error: "Missing params",
                })
            }
            const limit = parseInt(req.body.limit);
            const offset = (parseInt(req.body.page) - 1) * limit;

            let subs = [];
            const submissionsInQueue = await models.submission.findAll({
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
            });
            submissionsInQueue.map(sub => subs.push(sub.dataValues));
            let username = "";

            const userDataValues = await models.user.findByPk(req.params.userId);
            username = userDataValues.dataValues.username;
            if (username === null) {
                console.log('User Not Found')
                return res.status(404).json({
                    error: 'User Not Found',
                })
            }
            
            const user = req.user;
            const problem = await models.problem.findByPk(req.params.problemId);
            if (problem === null) {
                console.log('Problem Not Found')
                return res.status(404).json({
                    error: 'Problem Not Found',
                })
            }
            
            const problemName = problem.dataValues.title
            const checker = problem.dataValues.checker
            let subResult = {};
            for (let sub of subs) {
                if (sub && sub.id_submission) {
                    if (checker) {
                        subResult = await get_submission_details_checker(sub.tokens);
                    } else {
                        subResult = await get_submission_details_no_checker(sub.tokens, checker);
                    }
                    await models.submission.update(subResult, { where: { id_submission: sub.id_submission } })
                }

                // Create status for the problem
                const userProblem = await models.user_problem.findOne({
                    where: {
                        id_problem: req.params.problemId,
                        id_user: user.id_user
                    }
                });
                if (!userProblem) {
                    const newUserProblem = await models.user_problem.create({
                        id_user: user.id_user,
                        id_problem: req.params.problemId,
                        status: subResult.result,
                    });
                    if (newUserProblem.dataValues.status === 'Accepted') {
                        console.log('Submission accepted for the first time')
                        addScore(problem, user);
                        addLangs(user, sub, problem);
                        addSkills(problem,user);
                    }

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
                        );

                        if (subResult.result === 'Accepted') {
                            console.log('Submission accepted for the first time')
                            addScore(problem, user);
                            addLangs(user, sub, problem);
                            addSkills(problem,user);
                        }
                    } else {
                        console.log('Problem already solved')
                        addLangs(user, sub, problem);
                    }
                }
            }
            console.log(subResult);

            const submissions = await models.submission.findAndCountAll({
                where: {
                    userIdUser: req.params.userId,
                    problemIdProblem: req.params.problemId
                },
                offset: offset,
                limit: limit,
                subQuery: false,
                order: [["createdAt", "desc"]]
            });
            let result = []
            for (let sub of submissions.rows) {
                sub.dataValues.user = username
                sub.dataValues.problem = problemName
                result.push(sub.dataValues)
            }
            res.status(200).json({
                count: submissions.count,
                rows: result
            });
        }
        else {
            res.status(401).json({ message: 'Unauthorized' });
        }

    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}



exports.get_submissions_by_problem = async (req, res, next) => {
    try {
        if (!req.body.page || !req.body.limit) {
            return res.status(404).json({
                error: "Missing params",
            })
        }
        const limit = parseInt(req.body.limit);
        const offset = (parseInt(req.body.page) - 1) * limit;

        const submissions = await models.submission.findAndCountAll({
            where: {
                problemIdProblem: req.params.problemId
            },
            offset: offset,
            limit: limit,
            subQuery: false,
            order: [["createdAt", "desc"]]
        });
        let result = [];
        for (let sub of submissions.rows) {
            const user = await models.user.findByPk(sub.dataValues.userIdUser);
            if (user === null) {
                console.log('User Not Found')
                return res.status(404).json(err)
            }
            sub.dataValues.user = user.dataValues.username
            const problem = await models.problem.findByPk(sub.dataValues.problemIdProblem);
            if (problem === null) {
                console.log('Problem Not Found')
                return res.status(404).json(err)
            }
            sub.dataValues.problem = problem.dataValues.title;
            result.push(sub.dataValues);
        }
        return res.status(200).json({
            count: submissions.count,
            rows: result
        })

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}


exports.get_submissions_by_user = async (req, res, next) => {
    try {
        if (!req.body.page || !req.body.limit) {
            return res.status(404).json({
                error: "Missing params",
            })
        }
        const limit = parseInt(req.body.limit);
        const offset = (parseInt(req.body.page) - 1) * limit;

        const submissions = await models.submission.findAndCountAll({
            where: {
                userIdUser: req.params.userId
            },
            offset: offset,
            limit: limit,
            subQuery: false,
            order: [["createdAt", "desc"]]
        });
        let result = []
        for (let sub of submissions.rows) {
            let user = await models.user.findByPk(sub.dataValues.userIdUser);
            sub.dataValues.user = user.dataValues.username;
            let problem = await models.problem.findByPk(sub.dataValues.problemIdProblem)
            sub.dataValues.problem = problem.dataValues.title;
            result.push(sub.dataValues)
        }
        return res.status(200).json({
            count: submissions.count,
            rows: result
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json(err);

    }
}


exports.get_submission = async (req, res, next) => {
    try {
        const id = req.params.submissionId;
        const submission = await models.submission.findByPk(id)
        if (!submission) {
            return res.status(404).json({
                message: "Submission NOT FOUND"
            });
        }
        let result = []
        let code = ""
        const judgeResult = await axios.get(jugdeUrl + `submissions/batch?tokens=${submission.dataValues.tokens}&base64_encoded=false&fields=source_code,stdin,stdout,expected_output,status,time,memory`)

        console.log('Get submission from judge successful')
        const sub = judgeResult.data.submissions;
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
        return res.status(200).json({
            code: code,
            count: result.length,
            testCases: result
        });


    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err });
    }

}
