export enum SurveyType {
  benefitAction = "benefit-action",
  trackClickOnSimulationUsefulnessEmail = "track-click-on-simulation-usefulness-email",
  trackClickOnBenefitActionEmail = "track-click-on-benefit-action-email",
}

export interface SurveyAnswer {
  _id: string
  id: string
  value: string | boolean
  comments?: string
}

export interface SurveyBenefit {
  id: string
  amount: number | boolean
  unit: any
  value: any
  comment: any
}

export interface SurveyLayout {
  _id: string
  answers: SurveyAnswer[]
  repliedAt?: string
  messageId?: string
  error?: string | any
  type: SurveyType
}

export interface FollowupLayout {
  _id: string
  simulation: string
  email: string
  surveyOptin: boolean
  createdAt: string
  surveys: SurveyLayout[]
  version: number
  accessToken: string
  __v: number
  benefits: any
  messageId: string
  sentAt: string
  _oldId?: string
}
