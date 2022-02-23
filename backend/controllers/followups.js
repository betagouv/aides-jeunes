/* eslint-disable no-console */
const Followup = require("mongoose").model("Followup")

const situation = require("./answers")
const pollResult = require("../lib/mattermost-bot/poll-result")

exports.followup = function (req, res, next, id) {
  Followup.findById(id)
    .populate("answers")
    .exec(function (err, followup) {
      if (err) {
        return next(err)
      }
      if (!followup || !followup.answers._id) {
        return res.redirect("/")
      }
      req.followup = followup
      situation.situation(req, res, next, followup.answers)
    })
}

exports.resultRedirect = function (req, res) {
  situation.attachAccessCookie(req, res)
  res.redirect(req.answers.returnPath)
}

exports.persist = function (req, res) {
  if (!req.body.email || !req.body.email.length) {
    return res.status(400).send({ result: "KO" })
  }

  Followup.create({
    answers: req.answers,
    email: req.body.email,
    surveyOptin: req.body.surveyOptin,
  })
    .then((followup) => {
      return followup.sendInitialEmail()
    })
    .then(() => {
      return res.send({ result: "OK" })
    })
    .catch((error) => {
      console.error("error", error)
      return res.status(400).send({ result: "KO" })
    })
}

exports.showFromSurvey = function (req, res) {
  Followup.findOne({
    $or: [
      { "surveys._id": req.params.surveyId },
      { "surveys.accessToken": req.params.surveyId },
    ],
  }).then((followup) => {
    if (!followup) return res.sendStatus(404)

    res.send(followup)
  })
}

exports.showSurveyResults = function (req, res) {
  Followup.find({
    surveyOptin: true,
    surveys: { $exists: true, $ne: [] },
    "surveys.repliedAt": { $exists: true },
  })
    .skip(0)
    .limit(10)
    .sort({ "surveys.repliedAt": -1 })
    .then((followup) => {
      res.send(followup)
    })
}

exports.showSimulation = function (req, res) {
  Followup.findOne({
    _id: req.params.surveyId,
  })
    .then((simulation) => {
      if (!simulation) return res.sendStatus(404)
      res.send([simulation])
    })
    .catch((error) => {
      console.error("error", error)
      return res.sendStatus(400)
    })
}

exports.postSurvey = function (req, res) {
  Followup.findOne({
    $or: [
      { "surveys._id": req.params.surveyId },
      { "surveys.accessToken": req.params.surveyId },
    ],
  }).then((followup) => {
    if (!followup) return res.sendStatus(404)
    const token = followup.surveys.find(
      (survey) =>
        survey._id == req.params.surveyId ||
        survey.accessToken == req.params.surveyId
    )._id
    followup.updateSurvey(token, req.body).then(() => {
      res.sendStatus(201)
    })
    pollResult.postPollResult(followup, req.body)
  })
}
