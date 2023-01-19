export enum SurveyType {
  benefitAction = "benefit-action",
  trackClicSimulationUsefulnessEmail = "track-clic-simulation-usefulness-email",
}

export interface SurveyLayout {
  _id: string
  answers: any
  repliedAt?: string
  messageId?: string
  error?: any
  type: SurveyType
}
