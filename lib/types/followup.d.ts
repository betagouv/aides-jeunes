import { Document } from "mongoose"

import { Survey } from "./survey.js"

interface FollowupAttributes {
  _id: string
  simulation: any
  email?: string
  phone?: string
  createdAt: Date
  sentAt: Date
  smsSentAt: Date
  messageId: string
  smsMessageId: string
  smsSentAt: Date
  benefits: any
  surveyOptin: boolean
  surveys: Survey[]
  version: number
  error: any
  smsError: any
  smsSurveyError: any
  accessToken: string
  tousABordNotificationEmail: any
  __v: number
}

interface FollowupMethods {
  addSurveyIfMissing(surveyType: SurveyType): Promise<Survey>
  updateSurvey(action: SurveyType, data?: any)
  updateTemporarySimulationSurvey()
}

interface FollowupVirtuals {
  emailRenderPath: string
  recapSurveyPath: string
  recapPath: string
  returnPath: string
  shortResultPath: string
  surveyPath: string
  shortRecapPath: string
  shortSurveyPath: string
  smsSurveyPath: string
  surveyPathTracker: string
  wasUsefulPath: string
  wasNotUsefulPath: string
}

export interface Followup
  extends Document,
    FollowupAttributes,
    FollowupMethods,
    FollowupVirtuals {}
