import mongoose, { Model, HydratedDocument } from "mongoose"
import { FollowupInterface } from "@lib/types/followup.d.js"
import { SimulationInterface } from "@lib/types/simulation.d.js"
import { SurveyType } from "@lib/enums/survey.js"

export interface MongooseLayout {
  [id: string]: any
}

export interface IFollowupMethods {
  postSimulationResultsEmail(messageId: string): void
  renderSimulationResultsEmail(): any
  sendSimulationResultsEmail(): Promise<void>
  renderSurveyEmail(surveyType: SurveyType): any
  addSurveyIfMissing(surveyType: SurveyType): Promise<any>
  sendSurvey(surveyType: SurveyType): Promise<any>

  updateSurvey(action: SurveyType, data?: any)

  save()
}
export interface IFollowupModel
  extends Model<FollowupInterface>,
    FollowupInterface,
    IFollowupMethods {
  findByEmail(
    email: string
  ): Promise<HydratedDocument<FollowupInterface, IFollowupMethods>>
  emailRenderPath: string
  returnPath: string
  surveyPath: string
  tousABordNotificationCta: string
  surveyPathTracker: string
  wasUsefulPath: string
  wasNotUsefulPath: string
}
export interface IFollowup
  extends FollowupInterface,
    IFollowupMethods,
    IFollowupModel {}

export interface SimulationModel extends Model<SimulationInterface> {
  _id: mongoose.Types.ObjectId
  cookieName: string
  token: string
  returnPath: string
  isAccessible(keychain: Record<string, string>): boolean
  getSituation(): any
  compute(): Promise<any>
  findById(
    simulationId: mongoose.Types.ObjectId | string,
    callback: (error: Error, simulation: SimulationModel) => void
  )
  cookiePrefix(): string
  create(
    data: any,
    callback: (error: Error, simulation: SimulationModel) => void
  )
  hasFollowup: boolean
  save()
}
