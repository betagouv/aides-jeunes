import { Model } from "mongoose"
export interface MongooseLayout {
  [id: string]: any
}
export interface FollowupModel extends Model<MongooseLayout> {
  staticFindById(id: string): any
  findByEmail(id: string): any
}
export interface SimulationModel extends Model<MongooseLayout> {
  cookiePrefix(): string
}
