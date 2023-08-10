import Followup, { FollowupMongoInterface } from "../models/followup.js"
import Benefits from "../../data/all.js"
import pollResult from "../lib/mattermost-bot/poll-result.js"
import simulationController from "./simulation.js"
import { Response, NextFunction, Request } from "express"
import { FollowupRequest, SimulationRequest } from "../types/express.js"
import { SurveyType } from "../../lib/enums/survey.js"
import { FollowupFactory } from "../lib/followup-factory.js"
import { FetchSurveyLayout } from "../../lib/types/survey.d.js"

// TODO next line is to be updated once tokens are used globally
const excludeFields = ["accessToken", "surveys.accessToken"]
  .join(" -")
  .replace(/^/, "-")

export function followup(
  req: FollowupRequest,
  res: Response,
  next: NextFunction,
  id: string
) {
  Followup.findById(id)
    .populate("simulation")
    .exec(function (err: any, followup: FollowupMongoInterface) {
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

export function resultRedirect(req: SimulationRequest, res: Response) {
  simulationController.attachAccessCookie(req, res)
  res.redirect(req.simulation.returnPath)
}

export async function persist(req: SimulationRequest, res: Response) {
  if (!req.body.email || !req.body.email.length) {
    return res.status(400).send({ result: "KO" })
  }

  const simulation = req.simulation

  try {
    const followup = await FollowupFactory.create(
      simulation,
      req.body.email,
      req.body.surveyOptin
    )

    await followup.sendSimulationResultsEmail()

    return res.send({ result: "OK" })
  } catch (error) {
    console.error("error", error)
    return res.status(400).send({ result: "KO" })
  }
}

export function getFollowup(req: FollowupRequest, res: Response) {
  res.send({
    createdAt: req.followup.createdAt,
    benefits: req.followup.benefits.filter(
      (benefit) => benefit.id in Benefits.benefitsMap
    ),
  } as FetchSurveyLayout)
}

export function showSurveyResult(req: Request, res: Response) {
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

export function showSurveyResults(req: Request, res: Response) {
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
    .then((followup: FollowupMongoInterface[]) => {
      res.send(followup)
    })
}

export function showSurveyResultByEmail(req: Request, res: Response) {
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

export function showSimulation(req: Request, res: Response) {
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
  req: FollowupRequest,
  res: Response,
  next: NextFunction,
  accessToken: any
) {
  const followup: FollowupMongoInterface | null = await Followup.findOne({
    accessToken,
  })
  if (!followup) return res.sendStatus(404)
  req.followup = followup
  next()
}

export function postSurvey(req: FollowupRequest, res: Response) {
  req.followup.updateSurvey(SurveyType.benefitAction, req.body).then(() => {
    res.sendStatus(201)
  })
  pollResult.postPollResult(req.followup, req.body)
}

export async function updateWasUseful(req: FollowupRequest) {
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

async function updateTrackClickOnBenefitActionEmail(req: FollowupRequest) {
  const { followup } = req
  await followup.updateSurvey(SurveyType.trackClickOnBenefitActionEmail)
}

async function updateSurveyInFollowup(req: FollowupRequest) {
  const { surveyType } = req.params
  const { followup } = req

  switch (surveyType) {
    case SurveyType.trackClickOnSimulationUsefulnessEmail:
      await updateWasUseful(req)
      break
    case SurveyType.trackClickOnBenefitActionEmail:
      await updateTrackClickOnBenefitActionEmail(req)
      break
    case SurveyType.tousABordNotification:
      await followup.updateSurvey(SurveyType.tousABordNotification)
      break
    default:
      throw new Error("Unknown survey type")
  }
}

async function getRedirectUrl(req: FollowupRequest) {
  const { surveyType } = req.params
  const { followup } = req

  switch (surveyType) {
    case SurveyType.trackClickOnSimulationUsefulnessEmail:
    case SurveyType.trackClickOnBenefitActionEmail:
      await followup.addSurveyIfMissing(SurveyType.benefitAction)
      await followup.save()

      return followup.surveyPath
    case SurveyType.tousABordNotification:
      return "https://www.tadao.fr/713-Demandeur-d-emploi.html"
    default:
      throw new Error("Unknown survey type")
  }
}

export async function logSurveyLinkClick(req: FollowupRequest, res: Response) {
  try {
    await updateSurveyInFollowup(req)
    const redirectUrl = await getRedirectUrl(req)

    res.redirect(redirectUrl)
  } catch (error) {
    console.error("error", error)
    return res.sendStatus(404)
  }
}
