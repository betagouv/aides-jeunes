import { Document } from "mongoose"

import { SurveyLayout } from "./survey.js"

interface FollowupAttributes {
  _id: string
  simulation: any
  email?: string
  createdAt: Date
  sentAt: Date
  messageId: string
  surveySentAt: Date
  benefits: any
  surveyOptin: boolean
  surveys: SurveyLayout[]
  version: number
  error: any
  accessToken: string
  tousABordNotificationEmail: any
  __v: number
}

interface FollowupMethods {
  postSimulationResultsEmail(messageId: string): void
  renderSimulationResultsEmail(): any
  sendSimulationResultsEmail(): Promise<void>
  renderSurveyEmail(surveyType: SurveyType): any
  addSurveyIfMissing(surveyType: SurveyType): Promise<any>
  sendSurvey(surveyType: SurveyType): Promise<any>
  updateSurvey(action: SurveyType, data?: any)
}

interface FollowupVirtuals {
  emailRenderPath: string
  returnPath: string
  surveyPath: string
  tousABordNotificationCta: string
  surveyPathTracker: string
  wasUsefulPath: string
  wasNotUsefulPath: string
}

export interface FollowupInterface
  extends Document,
    FollowupAttributes,
    FollowupMethods,
    FollowupVirtuals {}
