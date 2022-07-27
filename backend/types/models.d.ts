import { Model } from "mongoose"
// FIXME: either duplicate mongoose schema logic or skip ts schema check
export interface MongooseLayout {
  [id: string]: any
}
export interface FollowupModel extends Model<MongooseLayout> {
  findByIdOrOldId(id: string): any
}
export interface SimulationModel extends Model<MongooseLayout> {
  cookiePrefix(): string
}
