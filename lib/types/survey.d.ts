export enum SurveyType {
  benefitAction = "benefit-action",
  trackClickOnSimulationUsefulnessEmail = "track-click-on-simulation-usefulness-email",
  trackClickOnBenefitActionEmail = "track-click-on-benefit-action-email",
}

export interface SurveyLayout {
  _id: string
  answers: any
  repliedAt?: string
  messageId?: string
  error?: any
  type: SurveyType
}
