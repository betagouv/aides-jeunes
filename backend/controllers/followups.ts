/* eslint-disable no-console */
import Followup from "../models/followup.js"

import pollResult from "../lib/mattermost-bot/poll-result.js"
import simulationController from "./simulation.js"
import { Response, NextFunction } from "express"
import { ajRequest } from "../types/express.js"
import config from "../config/index.js"

// TODO next line is to be updated once tokens are used globally
const excludeFields = ["accessToken", "surveys.accessToken"]
  .join(" -")
  .replace(/^/, "-")

export function followup(
  req: ajRequest,
  res: Response,
  next: NextFunction,
  id: string
) {
  Followup.findByIdOrOldId(id)
    .populate("simulation")
    .exec(function (err: any, followup: any) {
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

export function resultRedirect(req: ajRequest, res: Response) {
  simulationController.attachAccessCookie(req, res)
  res.redirect(req.simulation.returnPath)
}

export function persist(req: ajRequest, res: Response) {
  if (!req.body.email || !req.body.email.length) {
    return res.status(400).send({ result: "KO" })
  }

  Followup.create({
    simulation: req.simulation,
    email: req.body.email,
    surveyOptin: req.body.surveyOptin,
  })
    .then((followup) => {
      return followup.sendSimulationResultsEmail()
    })
    .then(() => {
      return res.send({ result: "OK" })
    })
    .catch((error) => {
      console.error("error", error)
      return res.status(400).send({ result: "KO" })
    })
}

export function getFollowup(req: ajRequest, res: Response) {
  res.send(req.followup)
}

export function showSurveyResult(req: ajRequest, res: Response) {
  Followup.findByIdOrOldId(req.params.surveyId)
    .then((simulation: any) => {
      if (!simulation) return res.sendStatus(404)
      res.send([simulation])
    })
    .catch((error: Error) => {
      console.error("error", error)
      return res.sendStatus(400)
    })
}

export function showSurveyResults(req: ajRequest, res: Response) {
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

export function showSurveyResultByEmail(req: ajRequest, res: Response) {
  Followup.findByEmail(req.params.email)
    .then((simulations: any) => {
      if (!simulations || !simulations.length) return res.sendStatus(404)
      res.send(simulations)
    })
    .catch((error: Error) => {
      console.error("error", error)
      return res.sendStatus(400)
    })
}

export function showSimulation(req: ajRequest, res: Response) {
  Followup.findByIdOrOldId(req.params.surveyId)
    .select(excludeFields)
    .then((simulation: any) => {
      if (!simulation) return res.sendStatus(404)
      res.send([simulation])
    })
    .catch((error: Error) => {
      console.error("error", error)
      return res.sendStatus(400)
    })
}

export async function followupByAccessToken(
  req: ajRequest,
  res: Response,
  next: NextFunction,
  accessToken: any
) {
  const followup = await Followup.findOne({ accessToken })
  if (!followup) return res.sendStatus(404)
  req.followup = followup
  next()
}

export function postSurvey(req: ajRequest, res: Response) {
  req.followup.updateSurvey("benefit-action", req.body).then(() => {
    res.sendStatus(201)
  })
  pollResult.postPollResult(req.followup, req.body)
}

export async function updateWasUseful(req: ajRequest, res: Response) {
  const answers = [
    {
      id: "wasUseful",
      value: req.params.wasuseful,
    },
  ]
  const { followup } = req
  await followup.updateSurvey("track-clic-simulation-usefulness-email", answers)
  const survey = followup.surveys.find(
    (survey) => survey.type === "benefit-action"
  )
  if (!survey) {
    const newSurvey = await followup.createSurvey("benefit-action")
    followup.surveys.push(newSurvey)
    await followup.save()
  }
  res.redirect(`${config.baseURL}${followup.surveyPath}`)
}
