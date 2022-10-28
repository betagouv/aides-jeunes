export enum SurveyType {
  benefitAction = "benefit-action",
  simulationUsefulness = "simulation-usefulness",
}

export interface SurveyLayout {
  _id: string
  answers: any
  repliedAt?: string
  messageId?: string
  error?: any
  type: SurveyType
}
