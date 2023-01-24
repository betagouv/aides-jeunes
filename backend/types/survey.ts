export enum SurveyType {
  benefitAction = "benefit-action",
  trackClickOnSimulationUsefulnessEmail = "track-clic-simulation-usefulness-email",
}

export interface SurveyLayout {
  _id: string
  answers: any
  repliedAt?: string
  messageId?: string
  error?: any
  type: SurveyType
}
