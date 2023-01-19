export enum SurveyType {
  benefitAction = "benefit-action",
  simulationUsefulness = "simulation-usefulness",
  trackClicBenefitActionEmail = "track-clic-benefit-action-email",
}

export interface SurveyLayout {
  _id: string
  answers: any
  repliedAt?: string
  messageId?: string
  error?: any
  type: SurveyType
}
