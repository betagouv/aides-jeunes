import mongoose, { Model } from "mongoose"
import { FollowupInterface } from "@lib/types/followup.d.js"
import { SimulationInterface } from "@lib/types/simulation.d.js"
import { SurveyType } from "@lib/enums/survey.js"

export interface MongooseLayout {
  [id: string]: any
}

export interface FollowupModel extends Model<FollowupInterface> {
  _id: mongoose.Schema.Types.ObjectId
  simulation: any
  accessToken: string
  surveyPath: string
  createdAt: Date
  findByEmail(id: string): any
  updateSurvey(action: SurveyType, data?: any)
  addSurveyIfMissing(action: SurveyType): void
  sendSimulationResultsEmail(): void
  create(parameters: {
    simulation: SimulationModel
    email: string
    surveyOptin: boolean
    accessToken: string
    benefits: {
      id: string
      amount: string
      unit: string
    }
    version: number
  }): Promise<FollowupModel>
  benefits?: any
  save(): void
}

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
