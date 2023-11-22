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
  surveySentAt: Date
  benefits: any
  surveyOptin: boolean
  surveys: Survey[]
  version: number
  error: any
  smsError: any
  accessToken: string
  tousABordNotificationEmail: any
  __v: number
}

interface FollowupMethods {
  postSimulationResultsEmail(messageId: string): void
  postSimulationResultsSms(messageId: string): void
  renderSimulationResultsEmail(): any
  renderSimulationResultsSms(): any
  sendSimulationResultsEmail(): Promise<void>
  sendSimulationResultsSms(): Promise<void>
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

export interface Followup
  extends Document,
    FollowupAttributes,
    FollowupMethods,
    FollowupVirtuals {}
