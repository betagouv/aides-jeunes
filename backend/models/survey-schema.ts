import mongoose from "mongoose"
import { MongooseLayout } from "../types/models.d.js"
import { SurveyType } from "../../lib/enums/survey.js"

const SurveySchema = new mongoose.Schema<MongooseLayout>(
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
        value: mongoose.Schema.Types.Mixed,
        comments: String,
      },
    ],
    type: {
      type: String,
      enum: SurveyType,
    },
  },
  { minimize: false, id: false }
)

export default SurveySchema
