import { SurveyCategory } from "../enums/survey.js"
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

export interface Survey {
  _id: string
  answers: SurveyAnswer[]
  repliedAt?: string
  messageId?: string
  error?: string | any
  type: SurveyCategory
  createdAt?: Date
  openedAt?: Date
}

interface FetchSurvey {
  createdAt: string | Date
  benefits: {
    id: string
    amount: number | boolean
  }[]
}
