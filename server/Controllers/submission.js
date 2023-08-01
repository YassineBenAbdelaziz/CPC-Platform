const submission = require('../Entities/submission');
const { models } = require('../sequelize');
const axios = require("axios");

const jugdeUrl = "http://localhost:2358/";

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
        code: req.body.code,
        tokens: "",
        lang: "",
        result: "In Queue",
        time: 0,
        memory: 0,
        problemIdProblem: req.body.problemId
    }

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

    await axios.get(jugdeUrl + "languages/" + bodies[0].language_id)
        .then(result => {
            submission.lang = result.data.name;
        }).catch(err => {
            console.log('Get language name from judge failed')
            console.log(err)
        });

    await models.submission.create(submission)
        .then(res.status(201).json({
            message: "Submission Created",
            submission: submission
        }))
        .catch(error => {
            console.log('Create submission failed')
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
                if (subResult.result !== "Accepted" && subResult.result !== "In Queue") {
                    subResult.result !== "Processing" ? subResult.result += " On" : subResult.result += ""
                    subResult.result += " Test Case " + (i + 1);
                    console.log(subResult)
                    break;
                }
            }
        }).catch(err => {
            console.log('Get submission from judge failed')
            console.log(err)
        });
    return subResult;
}


exports.get_submissions_by_problem = async (req, res, next) => {
    let sub = {};
    await models.submission.findOne({
        where: {
            problemIdProblem: req.params.problemId,
            result: "In Queue"
        }
    }).then(submission => {
        sub = submission && submission.dataValues
    })

    if (sub && sub.id_submission) {
        const subResult = await get_submission_details(sub.tokens);
        await models.submission.update(subResult, { where: { id_submission: sub.id_submission } })
    }

    await models.submission.findAll({
        where: {
            problemIdProblem: req.params.problemId
        }
    }).then(submissions => {
        res.status(200).json(submissions)
    })

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
