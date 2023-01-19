import mongoose from "mongoose"
import { MongooseLayout, FollowupModel } from "../types/models.d.js"

const SurveySchema = new mongoose.Schema<MongooseLayout, FollowupModel>(
  {
    _oldId: { type: String },
    accessToken: { type: String },
    createdAt: { type: Date, default: Date.now },
    messageId: { type: String },
    repliedAt: { type: Date },
    error: { type: Object },
    answers: [
      {
        id: String,
        value: String,
        comments: String,
      },
    ],
    type: {
      type: String,
      enum: ["benefit-action", "simulation-usefulness"],
    },
  },
  { minimize: false, id: false }
)

export default SurveySchema
