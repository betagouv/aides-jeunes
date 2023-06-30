import { Document } from "mongoose"

import { Survey } from "./survey.js"

interface FollowupAttributes {
  _id: string
  simulation: any
  email?: string
  phone?: string
  createdAt: Date
  sentAt: Date
  messageId: string
  surveySentAt: Date
  benefits: any
  surveyOptin: boolean
  surveys: Survey[]
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
  sendSimulationResultsSms(): Promise<void>
  renderSurveyEmail(surveyType: SurveyCategory): any
  addSurveyIfMissing(surveyType: SurveyCategory): Promise<any>
  sendSurvey(surveyType: SurveyCategory): Promise<any>
  updateSurvey(action: SurveyCategory, data?: any)
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

export interface Followup
  extends Document,
    FollowupAttributes,
    FollowupMethods,
    FollowupVirtuals {}
