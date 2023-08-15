import { SurveyType } from "../enums/survey.js"
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

interface FetchSurveyLayout {
  createdAt: string | Date
  benefits: {
    id: string
    amount: number | boolean
  }[]
}
