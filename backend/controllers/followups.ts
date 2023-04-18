/* eslint-disable no-console */
import Followup from "../models/followup.js"
import Benefits from "../../data/all.js"
import pollResult from "../lib/mattermost-bot/poll-result.js"
import simulationController from "./simulation.js"
import { Response, NextFunction } from "express"
import { ajRequest } from "../types/express.js"
import { SurveyType } from "../../lib/enums/survey.js"

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
  Followup.findById(id)
    .populate("simulation")
    .exec(function (err: any, followup: any) {
      if (err) {
        return next(err)
      }
      // no matching followup or wrong or missing access token
      if (
        !followup?.accessToken ||
        followup.accessToken !== req?.query?.token
      ) {
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

export async function persist(req: ajRequest, res: Response) {
  if (!req.body.email || !req.body.email.length) {
    return res.status(400).send({ result: "KO" })
  }

  try {
    const followup = await Followup.create({
      simulation: req.simulation,
      email: req.body.email,
      surveyOptin: req.body.surveyOptin,
    })

    req.simulation.hasFollowup = true

    await req.simulation.save()
    await followup.sendSimulationResultsEmail()

    return res.send({ result: "OK" })
  } catch (error) {
    console.error("error", error)
    return res.status(400).send({ result: "KO" })
  }
}

export function getFollowup(req: ajRequest, res: Response) {
  res.send({
    createdAt: req.followup.createdAt,
    benefits: req.followup.benefits.filter(
      (benefit) => benefit.id in Benefits.benefitsMap
    ),
  })
}

export function showSurveyResult(req: ajRequest, res: Response) {
  Followup.findById(req.params.surveyId)
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
    surveys: {
      $elemMatch: {
        repliedAt: { $exists: true },
        type: SurveyType.benefitAction,
      },
    },
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
  Followup.findById(req.params.surveyId)
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
  req.followup.updateSurvey(SurveyType.benefitAction, req.body).then(() => {
    res.sendStatus(201)
  })
  pollResult.postPollResult(req.followup, req.body)
}

export async function updateWasUseful(req: ajRequest) {
  const answers = [
    {
      id: "wasUseful",
      value: req.query.wasuseful !== undefined,
    },
  ]
  const { followup } = req
  await followup.updateSurvey(
    SurveyType.trackClickOnSimulationUsefulnessEmail,
    answers
  )
  await followup.save()
}

async function updateTrackClickOnBenefitActionEmail(req: ajRequest) {
  const { followup } = req
  await followup.updateSurvey(SurveyType.trackClickOnBenefitActionEmail)
}

export async function logSurveyLinkClick(req: ajRequest, res: Response) {
  const { surveyType } = req.params
  const { followup } = req
  switch (surveyType) {
    case SurveyType.trackClickOnSimulationUsefulnessEmail:
      await updateWasUseful(req)
      break
    case SurveyType.trackClickOnBenefitActionEmail:
      await updateTrackClickOnBenefitActionEmail(req)
      break
    default:
      return res.sendStatus(404)
  }
  await followup.addSurveyIfMissing(SurveyType.benefitAction)
  await followup.save()
  res.redirect(followup.surveyPath)
}
