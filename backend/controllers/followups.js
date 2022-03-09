/* eslint-disable no-console */
const Followup = require("mongoose").model("Followup")

const pollResult = require("../lib/mattermost-bot/poll-result")
const simulationController = require("./simulation")

// TODO next line is to be updated once tokens are used globally
const excludeFields = ["accessToken", "surveys.accessToken"]
  .join(" -")
  .replace(/^/, "-")

exports.followup = function (req, res, next, id) {
  Followup.findById(id)
    .populate("simulation")
    .exec(function (err, followup) {
      if (err) {
        return next(err)
      }
      // TODO remove unecessary condition when tokens are widely used
      if (
        !followup?.simulation?._id ||
        (req?.params?.token && followup?.accessToken !== req.params.token)
      ) {
        // no id specified or not matching access token
        return res.redirect("/")
      }
      req.followup = followup
      simulationController.simulation(req, res, next, followup.simulation)
    })
}

exports.resultRedirect = function (req, res) {
  simulationController.attachAccessCookie(req, res)
  res.redirect(req.simulation.returnPath)
}

exports.persist = function (req, res) {
  if (!req.body.email || !req.body.email.length) {
    return res.status(400).send({ result: "KO" })
  }

  Followup.create({
    simulation: req.simulation,
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
  // TODO remove unecessary OR condition when tokens are widely used
  Followup.findOne({
    $or: [
      { "surveys._id": req.params.surveyId },
      { "surveys.accessToken": req.params.surveyId },
      { accessToken: req.params.surveyId },
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
    .select(excludeFields)
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
  // TODO remove unecessary OR condition when tokens are widely used
  Followup.findOne({
    $or: [
      { "surveys._id": req.params.surveyId },
      { "surveys.accessToken": req.params.surveyId },
      { accessToken: req.params.surveyId },
    ],
  }).then((followup) => {
    if (!followup) return res.sendStatus(404)
    const token = followup.surveys[followup.surveys.length - 1]._id
    followup.updateSurvey(token, req.body).then(() => {
      res.sendStatus(201)
    })
    pollResult.postPollResult(followup, req.body)
  })
}
