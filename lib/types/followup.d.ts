import { SurveyLayout } from "./survey.js"
export interface FollowupInterface {
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
