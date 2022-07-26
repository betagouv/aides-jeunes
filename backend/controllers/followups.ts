/* eslint-disable no-console */
import mongoose from "mongoose"
import Followup from "../models/followup.js"
//const Followup = mongoose.model('Followup')

import pollResult from "../lib/mattermost-bot/poll-result.js"
import simulationController from "./simulation.js"

// TODO next line is to be updated once tokens are used globally
const excludeFields = ["accessToken", "surveys.accessToken"]
  .join(" -")
  .replace(/^/, "-")

export function followup(req, res, next, id) {
  Followup.findByIdOrOldId(id)
    .populate("simulation")
    .exec(function (err, followup) {
      if (err) {
        return next(err)
      }
      // TODO remove unecessary condition when tokens are widely used
      if (
        !followup?.simulation?._id ||
        (req?.query?.token && followup?.accessToken !== req.query.token)
      ) {
        // no id specified or not matching access token
        return res.redirect("/")
      }
      req.followup = followup
      simulationController.simulation(req, res, next, followup.simulation)
    })
}

export function resultRedirect(req, res) {
  simulationController.attachAccessCookie(req, res)
  res.redirect(req.simulation.returnPath)
}

export function persist(req, res) {
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

export function showFromSurvey(req, res) {
  // TODO remove unecessary OR condition when tokens are widely used
  Followup.findOne({ accessToken: req.params.surveyId }).then((followup) => {
    if (!followup) return res.sendStatus(404)
    res.send(followup)
  })
}

export function showSurveyResult(req, res) {
  Followup.findByIdOrOldId(req.params.surveyId)
    .then((simulation) => {
      if (!simulation) return res.sendStatus(404)
      res.send([simulation])
    })
    .catch((error) => {
      console.error("error", error)
      return res.sendStatus(400)
    })
}

export function showSurveyResults(req, res) {
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

export function showSimulation(req, res) {
  Followup.findByIdOrOldId(req.params.surveyId)
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

export function postSurvey(req, res) {
  // TODO remove unecessary OR condition when tokens are widely used
  Followup.findOne({ accessToken: req.params.surveyId }).then((followup) => {
    if (!followup) return res.sendStatus(404)
    const token = followup.surveys[followup.surveys.length - 1]._id
    followup.updateSurvey(token, req.body).then(() => {
      res.sendStatus(201)
    })
    pollResult.postPollResult(followup, req.body)
  })
}
