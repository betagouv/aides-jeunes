import mongoose from "mongoose"
import { MongooseLayout, SurveyModel } from "../types/models"

const SurveySchema = new mongoose.Schema<MongooseLayout, SurveyModel>(
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
